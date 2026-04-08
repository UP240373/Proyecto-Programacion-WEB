// Exportar variables de entorno, express y la base de datos
const express = require("express");
const db = require("./db");

// Configuracion de la app
const app = express();
const PORT = process.env.PORT || 3000;

// middlware para convertir JSON
app.use(express.json());

/*

  SETPOINTS

  GET /users = Obtener todos los usuarios


*/

// GET /users = Obtener todos los usuarios
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users`;

  db.query(query, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Not found connection with the base data", err});
    }

    res.status(200).json({ message: "Get information successfully.", users});
  })
})


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
})