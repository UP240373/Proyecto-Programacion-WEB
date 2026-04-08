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

*/


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
})