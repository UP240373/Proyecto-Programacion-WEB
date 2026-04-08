// Pedir el uso de MYSQL y generar las variables de entorno
const mysql = require("mysql2");
require('dotenv').config({ quiet: true });

// Crear la conexion a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Intentar Conectarse a la base de datos
connection.connect((err) => {
  console.log("Connection with the database...");
  if (err) {
    console.error("Error in the connection", err);
    return;
  } 
  console.log("Connection successfully");
});

// Exportacion de la conexion a la base de datos
module.exports = connection;