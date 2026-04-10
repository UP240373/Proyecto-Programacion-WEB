// Exportar variables de entorno, express y la base de datos
const express = require("express");
const cors = require('cors');
const logger = require('./logger');
const db = require("./db");

// Configuracion de la app
const app = express();
const PORT = process.env.PORT || 3000;

// middlware para convertir JSON
app.use(express.json());

// middlware para usar metodos en frontend configurando cors
app.use(cors({
    origin: 'http://localhost:3001', // El puerto de Next.js
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true
}));

/*

  SETPOINTS

  Metodos para users:
  GET /users = Obtener todos los usuarios
  GET /users/filter = Filtrar usuarios
  GET /users/{id} = Obtener usuario por ID
  POST /users = Crear usuario
  PATCH /users/{id}/status = Actualizar estado
  PUT /users/{id} = Editar usuario
  DELETE /users/{id} = Eliminar usuario

  Metodos para carrers:
  GET /careers = Obtener carreras
  GET /careers/filter = Filtrar carreras
  POST /careers = Crear carrera
  PUT /careers/{id} = Actualizar carrera
  DELETE /careers/{id} = Eliminar carrera

  Metodos para types y categories:
  GET /types = Obtener tipos de ticket
  POST /types = Crear tipo de ticket
  PUT /types/{id} = Actualizar tipo
  DELETE /types/{id} = Eliminar tipo
  GET /categories = Obtener categorías

*/

// GET /users = Obtener todos los usuarios
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users WHERE is_deleted = 0`;

  db.query(query, (err, users) => {
    if (err) {
      logger.error('GET_ALL_USERS', err, req.ip);
      return res.status(500).json({ error: "Database error", err});
    }
    logger.getAllUsers(users.length, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", users});
  });
});

// GET /users/filter = Filtrar usuarios
app.get('/users/filter', (req, res) => {
  const { name, email, career_id, rol } = req.query;

  let query = 'SELECT * FROM users WHERE is_deleted = 0';

  if (name) {
    query += ` AND name = "${name}"`;
  }

  if (email) {
    query += ` AND email = "${email}"`;
  }

  if (career_id) {
    query += ` AND career_id = "${career_id}"`;
  }

  if (rol) {
    query += ` AND rol = "${rol}"`;
  }
  
  db.query(query, (err, users) => {
    if (err) {
      logger.error('FILTER_USERS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (users.length === 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "User don't found"});
    }

    logger.filterUsers({ name, email, career_id, rol }, users.length, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", users });
  });
});

// GET /users/{id} = Obtener usuario por ID
app.get('/users/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id} AND is_deleted = 0`;

  db.query(query, (err, user) => {
    if (err) {
      logger.error('GET_USER_BY_ID', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const found = user.length > 0;
    logger.getUserById(req.params.id, found, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get user successfully", user});
  });
});

// POST /users = Crear usuario
app.post('/users', (req, res) => {
  const { name, last_name, username, email, career_id, active, password, rol, failed_attempts } = req.body;

  const filter = `SELECT * FROM users WHERE email = "${email}" OR username = "${username}"`;
  db.query(filter, (err, result) => {
    if (err) {
      logger.error('CREATE_USER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (result.length > 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(409).json({ err: "The username or email already exists"});
    }

    const query = `INSERT INTO users (name, last_name, username, email, career_id, active, password, rol, failed_attempts, is_deleted) VALUES ("${name}", "${last_name}", "${username}", "${email}", ${career_id}, ${active}, "${password}", "${rol}", ${failed_attempts}, 0);`;
    db.query(query, (err, user) => {
      if (err) {
        logger.error('CREATE_USER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.createUser(req.body, req.body.id, req.ip, req.headers['user-agent']);
      res.status(201).json({ message: "The user has been created successfully" });
    })
  });
});

// PATCH /users/{id}/status = Actualizar estado
app.patch('/users/:id/status', (req, res) => {
  const search = `SELECT * FROM users WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, user) => {
    if (err) {
      logger.error('UPDATE_USER_STATUS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const newStatus = user[0].active === 1 ? 0 : 1;
    const query = `UPDATE users SET active = ${newStatus} WHERE id = ${req.params.id};`
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_USER_STATUS', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "The user's status has been updated" });
    });
  });
});

// PUT /users/{id} = Editar usuario
app.put('/users/:id', (req, res) => {
  const search = `SELECT * FROM users WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, user) => {
    if (err) {
      logger.error('UPDATE_USER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const newChanges = req.body;
    const query = `UPDATE users SET name = "${newChanges.name}", last_name = "${newChanges.last_name}", username = "${newChanges.username}", email = "${newChanges.email}", career_id = ${newChanges.career_id}, active = ${newChanges.active}, password = "${newChanges.password}", rol = "${newChanges.rol}" WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_USER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.updateUser(req.params.id, req.body, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "The user has been updated" });
    });
  });
});

// DELETE /users/{id} = Eliminar usuario
app.delete('/users/:id', (req, res) => {
  const search = `SELECT * FROM users WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, user) => {
    if (err) {
      logger.error('DELETE_USER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const query = `UPDATE users SET is_deleted = 1 WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('DELETE_USER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.deleteUser(req.params.id, userToDelete, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "The user has been deleted." });
    });
  });
});

// GET /careers = Obtener carreras
app.get('/careers', (req, res) => {
  const query = `SELECT * FROM careers WHERE is_deleted = 0`;

  db.query(query, (err, careers) => {
    if (err) {
      logger.error('GET_ALL_CAREERS', err, req.ip);
      return res.status(500).json({ error: "Database error", err});
    }
    logger.getAllCareers(careers.length, req.ip, req.headers['career-agent']);
    res.status(200).json({ message: "Get information successfully", careers});
  });
});

// GET /careers/filter = Filtrar carreras
app.get('/careers/filter', (req, res) => {
  const { name, active } = req.query;

  let query = 'SELECT * FROM careers WHERE is_deleted = 0';

  if (name) {
    query += ` AND name = "${name}"`;
  }

  if (active) {
    query += ` AND active = "${active}"`;
  }

  db.query(query, (err, careers) => {
    if (err) {
      logger.error('FILTER_CAREERS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (careers.length === 0) {
      logger.getCareerById(req.params.id, false, req.ip, req.headers['career-agent']);
      return res.status(404).json({ error: "Careers don't found"});
    }

    logger.filterCareers({ name, active }, careers.length, req.ip, req.headers['career-agent']);
    res.status(200).json({ message: "Get information successfully", careers });
  });
});

// POST /careers = Crear carrera
app.post('/careers', (req, res) => {
  const { name, active } = req.body;

  const filter = `SELECT * FROM careers WHERE name = "${name}"`;
  db.query(filter, (err, result) => {
    if (err) {
      logger.error('CREATE_CARRER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (result.length > 0) {
      logger.getCareerById(req.params.id, false, req.ip, req.headers['career-agent']);
      return res.status(409).json({ err: "The career already exists"});
    }

    const query = `INSERT INTO careers (name, active, is_deleted) VALUES ("${name}", ${active}, 0);`;
    db.query(query, (err, career) => {
      if (err) {
        logger.error('CREATE_CAREER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.createCareer(req.body, req.body.id, req.ip, req.headers['career-agent']);
      res.status(201).json({ message: "The career has been created successfully" });
    })
  });
});

// PUT /careers/{id} = Actualizar carrera
app.put('/careers/:id', (req, res) => {
  const search = `SELECT * FROM careers WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, career) => {
    if (err) {
      logger.error('UPDATE_CAREER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (career.length === 0) {
      logger.getCareerById(req.params.id, false, req.ip, req.headers['career-agent']);
      return res.status(404).json({ error: "The career doesn't exists" });
    }

    const newChanges = req.body;
    const query = `UPDATE careers SET name = "${newChanges.name}", active = ${newChanges.active} WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_CAREER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.updateCareer(req.params.id, req.body, req.ip, req.headers['career-agent']);
      res.status(200).json({ message: "The career has been updated" });
    });
  });
});

// DELETE /careers/{id} = Eliminar carrera
app.delete('/careers/:id', (req, res) => {
  const search = `SELECT * FROM careers WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, career) => {
    if (err) {
      logger.error('DELETE_CAREER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (career.length === 0) {
      logger.getCareerById(req.params.id, false, req.ip, req.headers['career-agent']);
      return res.status(404).json({ error: "The career doesn't exists" });
    }

    const query = `UPDATE careers SET is_deleted = 1 WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('DELETE_CAREER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.deleteCareer(req.params.id, careerToDelete, req.ip, req.headers['career-agent']);
      res.status(200).json({ message: "The career has been deleted." });
    });
  });
});

// GET /types = Obtener tipos de ticket
app.get('/types', (req, res) => {
  const query = `SELECT * FROM types WHERE is_deleted = 0`;

  db.query(query, (err, types) => {
    if (err) {
      logger.error('GET_ALL_TYPES', err, req.ip);
      return res.status(500).json({ error: "Database error", err});
    }
    logger.getAllTypes(types.length, req.ip, req.headers['type-agent']);
    res.status(200).json({ message: "Get information successfully", types});
  });
});

// POST /types = Crear tipo de ticket
app.post('/types', (req, res) => {
  const { type, description, area } = req.body;

  const filter = `SELECT * FROM types WHERE type = "${type}"`;
  db.query(filter, (err, result) => {
    if (err) {
      logger.error('CREATE_TYPE', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (result.length > 0) {
      logger.getTypeById(req.params.id, false, req.ip, req.headers['type-agent']);
      return res.status(409).json({ err: "The type already exists"});
    }

    const query = `INSERT INTO types (type, description, area, is_deleted) VALUES ("${type}", "${description}", "${area}", 0);`;
    db.query(query, (err, user) => {
      if (err) {
        logger.error('CREATE_TYPE', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.createType(req.body, req.body.id, req.ip, req.headers['type-agent']);
      res.status(201).json({ message: "The type has been created successfully" });
    })
  });
});

// PUT /types/{id} = Actualizar tipo
app.put('/types/:id', (req, res) => {
  const search = `SELECT * FROM types WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, type) => {
    if (err) {
      logger.error('UPDATE_TYPE', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (type.length === 0) {
      logger.getUserById(req.params.id, false, req.ip, req.headers['type-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const newChanges = req.body;
    const query = `UPDATE types SET type = "${newChanges.type}", description = "${newChanges.description}", area = "${newChanges.area}" WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_TYPE', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.updateType(req.params.id, req.body, req.ip, req.headers['type-agent']);
      res.status(200).json({ message: "The type has been updated" });
    });
  });
});

// DELETE /types/{id} = Eliminar tipo
app.delete('/types/:id', (req, res) => {
  const search = `SELECT * FROM types WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, type) => {
    if (err) {
      logger.error('DELETE_TYPE', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (type.length === 0) {
      logger.getTypeById(req.params.id, false, req.ip, req.headers['type-agent']);
      return res.status(404).json({ error: "The career doesn't exists" });
    }

    const query = `UPDATE types SET is_deleted = 1 WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('DELETE_TYPE', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.deleteType(req.params.id, result, req.ip, req.headers['type-agent']);
      res.status(200).json({ message: "The type has been deleted." });
    });
  });
});

// GET /categories = Obtener categorías
app.get('/categories', (req, res) => {
  const query = `SELECT * FROM categories`;

  db.query(query, (err, categories) => {
    if (err) {
      logger.error('GET_ALL_CATEGORIES', err, req.ip);
      return res.status(500).json({ error: "Database error", err});
    }
    logger.getAllCategories(categories.length, req.ip, req.headers['categorie-agent']);
    res.status(200).json({ message: "Get information successfully", categories});
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});