import express from "express";
import db from "../db.js";

const router = express.Router();

//  consulta que obtiene todas las peliculas asociadas, con sus respectivos datos asociados en la cartelera. 
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.idCartelera, c.cine, c.formato, c.horarios, c.estado,
             p.titulo, p.portada_url
      FROM cartelera c
      JOIN pelicula p ON c.idPelicula = p.idPelicula
      ORDER BY c.estado DESC, p.titulo ASC
    `);
    res.json(rows);//  si tenemos error al obtener los datos emitimos el mensaje de error. 
  } catch (error) {
    console.error("Error al obtener cartelera:", error.message);
    res.status(500).json({ error: "Error al obtener cartelera" }); // este error se da cuando no hay datos error 500.
  }
});

export default router;