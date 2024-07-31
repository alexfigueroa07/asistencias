const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Ruta para buscar alumnos por nombre
router.get('/alumnos/search', (req, res) => {
    const query = req.query.query;
    const sql = `
        SELECT id, nombre, matricula 
        FROM alumno 
        WHERE nombre LIKE ? 
        LIMIT 10
    `;
    db.query(sql, [`%${query}%`], (err, results) => {
        if (err) {
            console.error('Error al hacer la peticion:', err);
            return res.status(500).json({ error: 'Error' });
        }
        res.json({ alumnos: results });
    });
});

// Ruta para obtener los detalles de un alumno por ID
router.get('/alumnos/:id', (req, res) => {
    const alumnoId = req.params.id;
    const sql = `
        SELECT nombre, matricula, edad, email 
        FROM alumno 
        WHERE id = ?
    `;
    db.query(sql, [alumnoId], (err, results) => {
        if (err) {
            console.error('Error fetching student details:', err);
            return res.status(500).json({ error: 'Error fetching student details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json({ alumno: results[0] });
    });
});

module.exports = router;
