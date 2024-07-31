const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/subjects', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No has iniciado sesión' });
    }

    const userId = req.session.user.id;

    const query = `
        SELECT 
            materia.id AS id_materia,
            materia.nombre AS nombre_materia,
            profesor.nombre AS nombre_profesor,
            grupo.id AS id_grupo,
            grupo.nombre AS nombre_grupo
        FROM 
            materia
        JOIN 
            profesor ON materia.id_profesor = profesor.id
        JOIN 
            usuario ON profesor.id_usuario = usuario.id
        JOIN 
            grupo ON materia.id_grupo = grupo.id
        WHERE 
            usuario.id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching subjects:', err);
            return res.status(500).json({ error: 'Error al obtener las materias' });
        }

        return res.json({ subjects: results });
    });
});



router.get('/professor', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No has iniciado sesión' });
    }

    const userId = req.session.user.id;

    const query = `
        SELECT profesor.nombre AS nombre_profesor
        FROM profesor
        JOIN usuario ON profesor.id_usuario = usuario.id
        WHERE usuario.id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching professor name:', err);
            return res.status(500).json({ error: 'Error al obtener el nombre del profesor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontró el profesor' });
        }

        return res.json({ professor_name: results[0].nombre_profesor });
    });
});



module.exports = router;
