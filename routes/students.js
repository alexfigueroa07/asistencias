const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/students', (req, res) => {
    const groupId = req.query.groupId;
    const materiaId = req.query.materiaId;
    console.log("GroupId:", groupId);
    console.log("MateriaId:", materiaId);

    if (!groupId || !materiaId) {
        return res.status(400).json({ error: 'Group ID and Materia ID are required' });
    }

    const query = `
        SELECT 
            alumno.nombre,
            alumno.matricula,
            alumno.edad,
            alumno.email,
            COALESCE(faltas.total_faltas, 0) AS total_faltas
        FROM 
            alumno
        LEFT JOIN (
            SELECT 
                id_alumno, 
                COUNT(*) AS total_faltas
            FROM 
                asistencia
            WHERE 
                tipo_asistencia = 'no asiste'
                AND id_materia = ?
            GROUP BY 
                id_alumno
        ) AS faltas ON alumno.id = faltas.id_alumno
        WHERE 
            alumno.id_grupo = ?;
    `;

    db.query(query, [materiaId, groupId], (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Error fetching students' });
        }
        res.json({ students: results });
    });
});

module.exports = router;
