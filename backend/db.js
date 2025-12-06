import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let db;

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
  });

  console.log("🔥 Conectado correctamente a la base de datos:", process.env.DB_NAME);
} catch (err) {
  console.error("❌ Error al conectar con MySQL:", err.message);
}

export default db;
