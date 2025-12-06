// backend/db.js
import mysql from "mysql2/promise"; // consultas.
import dotenv from "dotenv";
dotenv.config();

let db;

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "cine_track",
    port: 3306, // estándar
  });

  console.log("LEST FUCKING GOOOOOOO Conectado correctamente a la base de datos:", process.env.DB_NAME);
} catch (err) {
  console.error(" Error al conectar con MySQL:", err.message);
}

export default db;
