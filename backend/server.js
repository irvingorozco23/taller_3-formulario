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
        console.error("🔴 Error al conectar a la base de datos:", error);
        throw error;
    }
    console.log("🟢 ¡Conexión a la base de datos establecida exitosamente!");
});

// -------------------------------------------------------------------
// 4. RUTAS DE LA API (ENDPOINTS)
// -------------------------------------------------------------------

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
 * @route POST /api/estudiantes
 * @description Añade un nuevo estudiante, validando los datos primero.
 */
app.post('/api/estudiantes', (req, res) => {
    console.log("👉 Datos recibidos desde el formulario:", req.body);

    // ✅ PASO 1: VALIDACIÓN
    const { num_ine, nombre, apellido_paterno, telefono, correo } = req.body;

    if (!num_ine || !nombre || !apellido_paterno || !correo || !telefono) {
        return res.status(400).json({ error: "Los campos INE, nombre, apellido, teléfono y correo son obligatorios." });
    }
    if (!/^\d{10,13}$/.test(num_ine)) {
        return res.status(400).json({ error: "Formato de INE inválido (debe tener de 10 a 13 dígitos)." });
    }
    if (!/^\d{10}$/.test(telefono)) {
        return res.status(400).json({ error: "Formato de teléfono inválido (debe tener 10 dígitos)." });
    }
    if (!/^[a-zA-Z\s]{2,50}$/.test(nombre)) {
        return res.status(400).json({ error: "El nombre solo debe contener letras y tener entre 2 y 50 caracteres." });
    }

    if (!/^[a-zA-Z\s]{2,50}$/.test(apellido_paterno)) {
        return res.status(400).json({ error: "El apellido solo debe contener letras y tener entre 2 y 50 caracteres." });
     
    }
    
    // ✅ PASO 2: SI LA VALIDACIÓN PASA, SE GUARDA EN LA BASE DE DATOS
    const sql = "INSERT INTO estudiantes (num_ine, nombre, apellido_paterno, telefono, correo) VALUES (?)";
    const values = [num_ine, nombre, apellido_paterno, telefono, correo];

    connection.query(sql, [values], (error, result) => {
        if (error) {
            console.error("Error al añadir estudiante:", error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "El Núm. de INE o el correo ya existen." });
            }
            return res.status(500).json({ error: "Error interno del servidor al guardar." });
        }
        console.log("✅ Estudiante añadido exitosamente:", result.insertId);
        return res.status(201).json({ message: "Estudiante añadido exitosamente" });
    });
});


/**
 * @route DELETE /api/estudiantes/:id
 * @description Elimina un estudiante por su ID (num_ine).
 */
app.delete('/api/estudiantes/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM estudiantes WHERE num_ine = ?";

    connection.query(sql, [id], (error, result) => {
        if (error) {
            console.error("Error al eliminar estudiante:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }
        return res.json({ message: "Estudiante eliminado exitosamente" });
    });
});

// -------------------------------------------------------------------
// 5. INICIAR EL SERVIDOR
// -------------------------------------------------------------------
app.listen(port, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});
