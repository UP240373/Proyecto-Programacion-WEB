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

  ENDPOINTS

  Endpoints para login:
  POST /auth/login = Login
  GET /auth/profile = Obtener perfil
  POST /auth/logout = Logout

  Endpoints para users:
  GET /users = Obtener todos los usuarios
  GET /users/filter = Filtrar usuarios
  GET /users/{id} = Obtener usuario por ID
  POST /users = Crear usuario
  PATCH /users/{id}/status = Actualizar estado
  PUT /users/{id} = Editar usuario
  DELETE /users/{id} = Eliminar usuario

  Endpoints para carrers:
  GET /careers = Obtener carreras
  GET /careers/filter = Filtrar carreras
  POST /careers = Crear carrera
  PUT /careers/{id} = Actualizar carrera
  DELETE /careers/{id} = Eliminar carrera

  Endpoints para types y categories:
  GET /types = Obtener tipos de ticket
  POST /types = Crear tipo de ticket
  PUT /types/{id} = Actualizar tipo
  DELETE /types/{id} = Eliminar tipo
  GET /categories = Obtener categorías

  Endpoints para tickets:
  GET /tickets = Obtener todos los tickets
  POST /tickets = Crear ticket
  GET /tickets/{id} = Obtener ticket por ID
  GET /tickets/filter = Filtrar tickets
  PATCH /tickets/{id}/status = Cambiar estado del ticket
  PUT /tickets/{id} = Actualizar ticket
  DELETE /tickets/{id} = Eliminar ticket
  POST /tickets/assign = Asignar ticket a desarrollador
  GET /tickets/user/{id} = Obtener tickets por usuario

  Endpoints para KPI:
  GET /kpi/tickets/status = Tickets por estado
  GET /kpi/tickets/user = Tickets por usuario

*/

// POST /auth/login = Login
app.post('/auth/login', (req, res) => {
  const { email, password} = req.body;

  if (!email || !password) {
    logger.loginAttempt(email, false, 'missing_fields', req.ip, req.headers['user-agent']);
    return res.status(400).json({ success: false, error: "email and password are required" });
  }

  const query = `SELECT * FROM users WHERE email = "${email}"`;
  db.query(query, (err, user) => {
    if (err) {
      logger.error('LOGIN_DATABASE_ERROR', err, req.ip);
      return res.status(500).json({ success: false, error: "Database error", err });
    }

    if (user.length === 0) {
      logger.loginAttempt(email, false, 'user_not_found', req.ip, req.headers['user-agent']);
      return res.status(401).json({ success: false, error: "User doesn't found"});
    }

    if (user[0].is_deleted === 1) {
      logger.loginAttempt(email, false, 'user_not_found', req.ip, req.headers['user-agent']);
      return res.status(401).json({ success: false, error: "User doesn't found"});
    }

    if (user[0].failed_attempts >= 4) {
      logger.loginAttempt(email, false, 'a_lot_failed_attempts', req.ip, req.headers['user-agent']);
      return res.status(404).json({ success: false, error: "Many attempts have been made, please try again later"});
    }

    if (user[0].password != password) {
      logger.loginAttempt(email, false, 'password_incorrect', req.ip, req.headers['user-agent']);
      const failed = `UPDATE users SET failed_attempts = (failed_attempts + 1) WHERE id = ${user[0].id}`;
      db.query(failed);
      return res.status(404).json({ success: false, error: "Please password Incorrect, Try Again", failed_attempts: (user[0].failed_attempts + 1)});
    }

    const query = `UPDATE users SET failed_attempts = 0, active = 1 WHERE id = ${user[0].id}`;
    db.query(query);

    logger.loginAttempt(email, true, user.id, req.ip, req.headers['user-agent']);
    res.status(200).json({ success: true, message: "Login successful", user});

  });
});

// GET /auth/profile = Obtener perfil
app.post('/auth/profile' , (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.body.id} AND is_deleted = 0`;

  db.query(query, (err, user) => {
    if (err) {
      logger.error('GET_PROFILE_DATABASE_ERROR', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    logger.getProfile(req.params.id, user, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get user successfully", user});
  });
});

// POST /auth/logout = Logout
app.post('/auth/logout', (req, res) => {
  const id = req.body.id;
  logger.logout(id, req.ip, req.headers['user-agent']);

  const query = `UPDATE users SET active = 0 WHERE id = ${id}`;
  db.query(query);
  
  res.status(200).json({ message: 'Logout successful' });
});

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
  const { name, last_name, username, email, career_id, active, password, rol } = req.body;

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

    const query = `INSERT INTO users (name, last_name, username, email, career_id, active, password, rol, failed_attempts, is_deleted) VALUES ("${name}", "${last_name}", "${username}", "${email}", ${career_id}, ${active}, "${password}", "${rol}", 0, 0);`;
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
    logger.getAllCareers(careers.length, req.ip, req.headers['user-agent']);
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
      logger.getCareerById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "Careers don't found"});
    }

    logger.filterCareers({ name, active }, careers.length, req.ip, req.headers['user-agent']);
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
      logger.getCareerById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(409).json({ err: "The career already exists"});
    }

    const query = `INSERT INTO careers (name, active, is_deleted) VALUES ("${name}", ${active}, 0);`;
    db.query(query, (err, career) => {
      if (err) {
        logger.error('CREATE_CAREER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.createCareer(req.body, req.body.id, req.ip, req.headers['user-agent']);
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
      logger.getCareerById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The career doesn't exists" });
    }

    const newChanges = req.body;
    const query = `UPDATE careers SET name = "${newChanges.name}", active = ${newChanges.active} WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_CAREER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.updateCareer(req.params.id, req.body, req.ip, req.headers['user-agent']);
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
      logger.getCareerById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The career doesn't exists" });
    }

    const query = `UPDATE careers SET is_deleted = 1 WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('DELETE_CAREER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.deleteCareer(req.params.id, careerToDelete, req.ip, req.headers['user-agent']);
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
    logger.getAllTypes(types.length, req.ip, req.headers['user-agent']);
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
      logger.getTypeById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(409).json({ err: "The type already exists"});
    }

    const query = `INSERT INTO types (type, description, area, is_deleted) VALUES ("${type}", "${description}", "${area}", 0);`;
    db.query(query, (err, user) => {
      if (err) {
        logger.error('CREATE_TYPE', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.createType(req.body, req.body.id, req.ip, req.headers['user-agent']);
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
      logger.getUserById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const newChanges = req.body;
    const query = `UPDATE types SET type = "${newChanges.type}", description = "${newChanges.description}", area = "${newChanges.area}" WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_TYPE', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.updateType(req.params.id, req.body, req.ip, req.headers['user-agent']);
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
      logger.getTypeById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The career doesn't exists" });
    }

    const query = `UPDATE types SET is_deleted = 1 WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('DELETE_TYPE', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.deleteType(req.params.id, result, req.ip, req.headers['user-agent']);
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
    logger.getAllCategories(categories.length, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", categories});
  });
});

// GET /tickets = Obtener todos los tickets
app.get('/tickets', (req, res) => {
  const query = `SELECT * FROM tickets WHERE is_deleted = 0`;

  db.query(query, (err, tickets) => {
    if (err) {
      logger.error('GET_ALL_TICKETS', err, req.ip);
      return res.status(500).json({ error: "Database error", err});
    }
    logger.getAllTickets(tickets.length, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", tickets});
  });
});

// GET /tickets/filter = Filtrar tickets
app.get('/tickets/filter', (req, res) => {
  const { title, description, type_id, status, priority } = req.query;

  let query = 'SELECT * FROM tickets WHERE is_deleted = 0';

  if (title) {
    query += ` AND title = "${title}"`;
  }

  if (description) {
    query += ` AND description = "${description}"`;
  }

  if (type_id) {
    query += ` AND type_id = "${type_id}"`;
  }

  if (status) {
    query += ` AND status = "${status}"`;
  }

  if (priority) {
    query += ` AND priority = "${priority}"`;
  }
  
  db.query(query, (err, tickets) => {
    if (err) {
      logger.error('FILTER_TICKETS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (tickets.length === 0) {
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "Ticket don't found"});
    }

    logger.filterTickets({ title, description, type_id, status, priority }, tickets.length, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", tickets });
  });
});

// GET /tickets/{id} = Obtener ticket por ID
app.get('/tickets/:id', (req, res) => {
  const query = `SELECT * FROM tickets WHERE id = ${req.params.id} AND is_deleted = 0`;

  db.query(query, (err, ticket) => {
    if (err) {
      logger.error('GET_TICKET_BY_ID', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (ticket.length === 0) {
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The ticket doesn't exists" });
    }

    const found = ticket.length > 0;
    logger.getTicketById(req.params.id, found, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get ticket successfully", ticket});
  });
});

// POST /tickets = Crear ticket
app.post('/tickets', (req, res) => {
  const { title, description, type_id, status, priority, created_by } = req.body;

  const filter = `SELECT * FROM tickets WHERE title = "${title}"`;
  db.query(filter, (err, result) => {
    if (err) {
      logger.error('CREATE_TICKET', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (result.length > 0) {
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(409).json({ err: "The ticket already exists"});
    }

    const query = `INSERT INTO tickets (title, description, type_id, status, priority, created_by, is_deleted) VALUES ("${title}", "${description}", ${type_id}, "${status}", "${priority}", ${created_by}, 0);`;
    db.query(query, (err, ticket) => {
      if (err) {
        logger.error('CREATE_TICKET', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.createTicket(req.body, req.body.id, req.ip, req.headers['user-agent']);
      res.status(201).json({ message: "The ticket has been created successfully" });
    });
  });
});

// PATCH /tickets/{id}/status = Cambiar estado del ticket
app.patch('/tickets/:id/status', (req, res) => {
  const search = `SELECT * FROM tickets WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, ticket) => {
    if (err) {
      logger.error('UPDATE_TICKET_STATUS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (ticket.length === 0) {
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The ticket doesn't exists" });
    }

    const newStatus = req.body.status;
    const query = `UPDATE tickets SET status = "${newStatus}" WHERE id = ${req.params.id};`
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_TICKET_STATUS', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "The ticket's status has been updated" });
    });
  });
});

// PUT /tickets/{id} = Editar ticket
app.put('/tickets/:id', (req, res) => {
  const search = `SELECT * FROM tickets WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, ticket) => {
    if (err) {
      logger.error('UPDATE_TICKET', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (ticket.length === 0) {
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The ticket doesn't exists" });
    }

    const newChanges = req.body;
    const query = `UPDATE tickets SET title = "${newChanges.title}", description = "${newChanges.description}", type_id = "${newChanges.type_id}", status = "${newChanges.status}", priority = "${newChanges.priority}", created_by = ${newChanges.created_by} WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('UPDATE_TICKET', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.updateTicket(req.params.id, req.body, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "The ticket has been updated" });
    });
  });
});

// DELETE /tickets/{id} = Eliminar ticket
app.delete('/tickets/:id', (req, res) => {
  const search = `SELECT * FROM tickets WHERE id = ${req.params.id} AND is_deleted = 0`;
  db.query(search, (err, ticket) => {
    if (err) {
      logger.error('DELETE_TICKET', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (ticket.length === 0) {
      logger.getTicketById(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The ticket doesn't exists" });
    }

    const query = `UPDATE tickets SET is_deleted = 1 WHERE id = ${req.params.id}`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('DELETE_TICKET', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }
      logger.deleteTicket(req.params.id, result, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "The ticket has been deleted." });
    });
  });
});

// POST /tickets/assign = Asignar ticket a desarrollador
app.post('/tickets/assign', (req, res) => {
  const { id_ticket, id_user } = req.body;

  const find = `SELECT * FROM tickets WHERE id = ${id_ticket}`;
  db.query(find, (err, ticket) => {
    if (err) {
      logger.error('ASSIGN_TICKET', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (ticket.length === 0) {
      logger.getTicketsByUser(id_ticket, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The ticket doesn't exists" });
    }

    const query = `INSERT INTO tickets_devs (id_ticket, id_user) VALUES (${id_ticket}, ${id_user});`;
    db.query(query, (err, result) => {
      if (err) {
        logger.error('ASSIGN_TICKET', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.assignTicket(id_ticket, id_user, req.ip, req.headers['user-agent']);
      res.status(201).json({ message: "A user was successfully assigned to the ticket"});
    });
  });
});

// GET /tickets/user/{id} = Obtener tickets por usuario
app.get('/tickets/user/:id', (req, res) => {
  const find = `SELECT * FROM tickets WHERE id = ${req.params.id} AND is_deleted = 0`;

  db.query(find, (err, user) => {
    if (err) {
      logger.error('GET_TICKETS_BY_USER', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      logger.getTicketsByUser(req.params.id, false, req.ip, req.headers['user-agent']);
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const query = `SELECT * FROM tickets WHERE id IN (select id_ticket from tickets_devs where id_user = ${req.params.id})`;
    db.query(query, (err, tickets) => {
      if (err) {
        logger.error('GET_TICKETS_BY_USER', err, req.ip);
        return res.status(500).json({ error: "Database error", err });
      }

      logger.getTicketsByUser(req.params.id, tickets.length, req.ip, req.headers['user-agent']);
      res.status(200).json({ message: "Get tickets successfully", tickets });
    });
  });
});

// GET /kpi/tickets/status = Tickets por estado
app.get('/kpi/tickets/status', (req, res) => {
  const query = `SELECT * FROM tickets WHERE is_deleted = 0 ORDER BY status DESC`;

  db.query(query, (err, tickets) => {
    if (err) {
      logger.error('KPI_TICKETS_BY_STATUS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (tickets.length === 0) {
      logger.error('KPI_TICKETS_BY_STATUS', err, req.ip);
      return res.status(404).json({ error: "Don't exist tickets in the database", err });
    }

    logger.getTicketsByStatusKPI(tickets, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", tickets });
  });
});

// GET /kpi/tickets/user = Tickets por usuario
app.get('/kpi/tickets/user', (req, res) => {
  const query = `SELECT GROUP_CONCAT(u.name SEPARATOR ', ') as usuario_asignado, t.* FROM tickets t LEFT JOIN tickets_devs td ON t.id = td.id_ticket LEFT JOIN users u ON td.id_user = u.id GROUP BY t.id ORDER BY u.name ASC`;

  db.query(query, (err, tickets) => {
    if (err) {
      logger.error('KPI_TICKETS_BY_USERS', err, req.ip);
      return res.status(500).json({ error: "Database error", err });
    }

    if (tickets.length === 0) {
      logger.error('KPI_TICKETS_BY_USERS', err, req.ip);
      return res.status(404).json({ error: "Don't exist tickets in the database", err });
    }

    logger.getTicketsByUserKPI(tickets, req.ip, req.headers['user-agent']);
    res.status(200).json({ message: "Get information successfully", tickets });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});