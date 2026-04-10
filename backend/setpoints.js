// Exportar variables de entorno, express y la base de datos
const express = require("express");
const cors = require('cors');
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

  GET /users = Obtener todos los usuarios
  GET /users/filter = Filtrar usuarios
  GET /users/{id} = Obtener usuario por ID
  POST /users = Crear usuario
  PATCH /users/{id}/status = Actualizar estado

*/

// GET /users = Obtener todos los usuarios
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users`;

  db.query(query, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Database error", err});
    }

    res.status(200).json({ message: "Get information successfully", users});
  });
});

// GET /users/filter = Filtrar usuarios
app.get('/users/filter', (req, res) => {
  const { name, email, career_id, rol } = req.query;
  
  let query = 'SELECT * FROM users WHERE 1 = 1';

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
      return res.status(500).json({ error: "Database error", err });
    }

    if (users.length === 0) {
      return res.status(404).json({ error: "User don't found"});
    }

    res.status(200).json({ message: "Success", users });
  });
});

// POST /users = Crear usuario
app.get('/users/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

  db.query(query, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    res.status(200).json({ message: "Get user successfully", user});
  });
});

// POST /users = Crear usuario
app.post('/users', (req, res) => {
  const { name, last_name, username, email, career_id, active, password, rol, failed_attempts } = req.body;

  const filter = `SELECT * FROM users WHERE email = "${email}" OR username = "${username}"`;
  db.query(filter, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error", err });
    }

    if (result.length > 0) {
      return res.status(409).json({ err: "The username or email already exists"});
    }

    const query = `INSERT INTO users (name, last_name, username, email, career_id, active, password, rol, failed_attempts) VALUES ("${name}", "${last_name}", "${username}", "${email}", ${career_id}, ${active}, "${password}", "${rol}", ${failed_attempts});`;
    db.query(query, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error", err });
      }
      res.status(201).json({ message: "The user has been created successfully" });
    })
  });
});

// PATCH /users/{id}/status = Actualizar estado
app.patch('/users/:id/status', (req, res) => {
  const search = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(search, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error", err });
    }

    if (user.length === 0) {
      return res.status(404).json({ error: "The user doesn't exists" });
    }

    const newStatus = user[0].active === 1 ? 0 : 1;
    const query = `UPDATE users SET active = ${newStatus} WHERE id = ${req.params.id};`
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error", err });
      }
      res.status(200).json({message: "The user's status has been updated" });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});