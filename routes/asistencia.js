const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/group-info', (req, res) => {
    const groupId = req.query.groupId;

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required' });
    }

    const query = `
        SELECT nombre, matricula, edad, email
        FROM alumno
        WHERE id_grupo = ?
    `;

    db.query(query, [groupId], (err, results) => {
        if (err) {
            console.error('Error fetching group info:', err);
            return res.status(500).json({ error: 'Error fetching group info' });
        }
        res.json({ students: results });
    });
});

router.post('/record-attendance', (req, res) => {
    const { id_materia, id_grupo, attendance } = req.body;

    if (!id_materia || !id_grupo || !attendance) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const date = new Date().toISOString().split('T')[0]; 

    const query = `
        INSERT INTO asistencia (fecha, hora_entrada, hora_salida, id_materia, id_alumno, tipo_asistencia)
        VALUES ?
    `;

    const values = attendance.map(record => [
        date,
        record.hora_entrada,
        record.hora_salida,
        id_materia,
        record.id_alumno,
        record.tipo_asistencia
    ]);

    db.query(query, [values], (err, results) => {
        if (err) {
            console.error('Error recording attendance:', err);
            return res.status(500).json({ error: 'Error recording attendance' });
        }
        res.json({ message: 'Attendance recorded successfully' });
    });
});

module.exports = router;
