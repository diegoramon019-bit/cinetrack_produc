import express from "express";
import db from "../db.js";

const router = express.Router();

/* 
   consulta que obtiene todas las reseñas por peliculas. 
*/
router.get("/:idPelicula", async (req, res) => {
  const { idPelicula } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT r.idResena, r.contenido, r.calificacion, r.fecha,
              u.nombre AS usuario
       FROM resena r
       JOIN usuario u ON r.idUsuario = u.idUsuario
       WHERE r.idPelicula = ?
       ORDER BY r.fecha DESC`, // oerdenamos las consultas de menor a mayor. 
      [idPelicula]
    );

    res.json(rows);
  } catch (error) {
    console.error(" Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
});

/* 
   usamos el metodo post para guardar la reseñaen la base de datos. 
 */
router.post("/", async (req, res) => {
  const { idUsuario, idPelicula, contenido, calificacion } = req.body;

  if (!idUsuario || !idPelicula || !contenido) {
    return res.status(400).json({ error: "Faltan datos para registrar la reseña por favor completalos" }); // faltan campos.
  }

  try {
    const [result] = await db.query( // esta consulta carga, las reseñas de las peliculas. 
      "INSERT INTO resena (idUsuario, idPelicula, contenido, calificacion) VALUES (?, ?, ?, ?)",
      [idUsuario, idPelicula, contenido, calificacion || 0]
    );

    res.status(201).json({
      message: "Reseña agregada correctamente",
      idResena: result.insertId,
    });
  } catch (error) {
    console.error("Error al agregar reseña:", error); // si la reseña no responde. 
    res.status(500).json({ error: "Error al agregar reseña" });
  }
});

export default router;