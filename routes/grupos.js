const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/group-info', (req, res) => {
    const groupId = req.query.groupId;

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required' });
    }

    const query = `
        SELECT id, nombre, matricula, email
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

module.exports = router;
