import express from "express";
import db from "../db.js";

const router = express.Router();

/* 
 Obtener todas las películas
*/
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT idPelicula, titulo, genero, descripcion, anio, duracion, director, portada_url, plataformas
      FROM pelicula
      ORDER BY idPelicula DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas:", error.message);
    res.status(500).json({ error: "Error al obtener películas" });
  }
});

/* 
  consulta que obtiene una película por ID detalle + sinopsis
*/
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT idPelicula, titulo, genero, descripcion, anio, duracion, director, portada_url, plataformas
      FROM pelicula
      WHERE idPelicula = ?
    `, [id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Película no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error(" Error al obtener película:", error.message);
    res.status(500).json({ error: "Error al obtener película" });
  }
});

/* 
    consulta que obtiene la plataforma en donde se visualizan los datos. 
 */
router.get("/plataformas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT titulo, plataformas 
      FROM pelicula 
      WHERE idPelicula = ?
    `, [id]);

    if (rows.length === 0) // 404 not found -- no se encontro pelicula.
      return res.status(404).json({ error: "Película no encontrada" });

    const pelicula = rows[0];

    // Si no tiene plataformas registradas
    if (!pelicula.plataformas) {
      return res.json({
        titulo: pelicula.titulo,
        plataformas: null,
        mensaje: "No hay información disponible sobre dónde ver esta película."
      });
    }

    res.json({
      titulo: pelicula.titulo,
      plataformas: pelicula.plataformas
    });

  } catch (error) {
    console.error("Error al obtener plataformas:", error.message);
    res.status(500).json({ error: "Error al obtener información de plataformas" });
  }
});

export default router;