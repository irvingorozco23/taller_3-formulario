// -------------------------------------------------------------------
// 1. IMPORTACIONES Y CONFIGURACIÓN INICIAL
// -------------------------------------------------------------------
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// -------------------------------------------------------------------
// 2. MIDDLEWARE
// -------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------
// 3. CONEXIÓN A LA BASE DE DATOS MYSQL
// -------------------------------------------------------------------
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(error => {
    if (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
    console.log("¡Conexión a la base de datos establecida exitosamente!");
});

// -------------------------------------------------------------------
// 4. RUTAS DE LA API (ENDPOINTS)
// -------------------------------------------------------------------
/**
 * @route POST /api/estudiantes
 * @description Añade un nuevo estudiante a la base de datos.
 */
app.post('/api/estudiantes', (req, res) => {
    const sql = "INSERT INTO estudiantes (num_ine,nombre,apellido_paterno,telefono,correo) VALUES (?)";
    
    // ✅ CORRECCIÓN DEFINITIVA: Los nombres coinciden con el frontend y la BD
    const values = [
        req.body.num_ine,
        req.body.nombre,
        req.body.apellido_paterno,
        req.body.telefono,
        req.body.correo
    ];

    connection.query(sql, [values], (error, result) => {
        if (error) {
            console.error("Error al añadir estudiante:", error);
            return res.status(500).json({ error: "Error interno del servidor", details: error.sqlMessage });
        }
        console.log("Estudiante añadido exitosamente:", result);
        return res.status(201).json({ message: "Estudiante añadido exitosamente" });
    });
});


/**
 * @route GET /api/estudiantes
 * @description Obtiene la lista completa de estudiantes.
 */
app.get('/api/estudiantes', (req, res) => {
    const sql = "SELECT * FROM estudiantes";
    connection.query(sql, (error, data) => {
        if (error) {
            console.error("Error al obtener estudiantes:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        return res.json(data);
    });
});

/**
 * @route DELETE /api/estudiantes/:id
 * @description Elimina un estudiante por su ID (num_ine).
 */
app.delete('/api/estudiantes/:id', (req, res) => {
    // Obtenemos el ID de los parámetros de la URL
    const id = req.params.id;
    const sql = "DELETE FROM estudiantes WHERE num_ine = ?";

    connection.query(sql, [id], (error, result) => {
        if (error) {
            console.error("Error al eliminar estudiante:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        
        // `affectedRows` nos dice si se borró algo. Si es 0, el ID no existía.
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        return res.json({ message: "Estudiante eliminado exitosamente" });
    });
});

// -------------------------------------------------------------------
// 5. INICIAR EL SERVIDOR
// -------------------------------------------------------------------
// Usamos el puerto definido en el .env o el 3001 como alternativa

app.listen(port, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});
