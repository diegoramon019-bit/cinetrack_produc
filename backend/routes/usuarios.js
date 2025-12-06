import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

const router = express.Router();

/* 
   registro del usuario.
*/
router.post("/register", async (req, res) => {
  const { nombre, correo, pass } = req.body;

  try {
    if (!nombre || !correo || !pass)
      return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const [existente] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (existente.length > 0)
      return res.status(409).json({ error: "El correo ya está registrado" }); //comparamos el correo existente.

    const hashed = await bcrypt.hash(pass, 10); // caso contrario insertamos los valores.
    await db.query("INSERT INTO usuario (nombre, correo, pass) VALUES (?, ?, ?)", [
      nombre,
      correo,
      hashed,
    ]);
    //mensaje de registro exitoso,. 
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error en /register:", error.message);
    res.status(500).json({ error: "Error en el registro" });
  }
});

/* 
 si faltan datos en el login 
*/
router.post("/login", async (req, res) => {
  const { correo, pass } = req.body;

  try {
    if (!correo || !pass)
      return res.status(400).json({ error: "Correo y contraseña son requeridos" });

    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (rows.length === 0)
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });

    const usuario = rows[0];
    const match = await bcrypt.compare(pass, usuario.pass);
    if (!match)
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });

    res.json({
      message: "Login correcto",
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        foto_perfil: usuario.foto_perfil || null,
        bio: usuario.bio || "",
      },
    });
  } catch (error) {
    console.error("Error en /login:", error.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

/* 
   SUBIR / ACTUALIZAR FOTO DE PERFIL
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/fotos"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);// sube a la bae de datos la foto que uso el usuario. 
  },
});
const upload = multer({ storage }); //almancena de manera local. 

router.post("/foto/:id", upload.single("foto"), async (req, res) => {
  const foto = req.file ? req.file.filename : null;

  if (!foto) return res.status(400).json({ error: "No se recibió ninguna imagen" }); ///si no hay imagen. 

  try {
    await db.query("UPDATE usuario SET foto_perfil = ? WHERE idUsuario = ?", [foto, req.params.id]);
    res.json({ mensaje: "Foto actualizada correctamente", archivo: foto });
  } catch (error) {
    console.error("Error al subir foto:", error);
    res.status(500).json({ error: "Error al subir la foto" });
  }
});

/* 
   ACTUALIZAR BIOGRAFÍA
 */
router.put("/bio/:id", async (req, res) => {
  const { bio } = req.body;
  try {
    await db.query("UPDATE usuario SET bio = ? WHERE idUsuario = ?", [bio, req.params.id]);
    res.json({ mensaje: "Biografía actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar bio:", error);
    res.status(500).json({ error: "Error al actualizar biografía" });
  }
});

/* 
 consulta que obtiene todas las reseñas del usuario. 
*/
router.get("/resenas/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.idResena, r.contenido, r.calificacion, p.titulo, p.portada_url
       FROM resena r 
       JOIN pelicula p ON r.idPelicula = p.idPelicula
       WHERE r.idUsuario = ? 
       ORDER BY r.fecha DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
});

/* 
   OBTENER PERFIL DE USUARIO
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT idUsuario, nombre, correo, foto_perfil, bio FROM usuario WHERE idUsuario = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(" Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

export default router;