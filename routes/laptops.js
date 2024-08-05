const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/laptops', (req, res) => {


    const query = `
        SELECT *
        FROM laptops
    `;

    db.query(query, (err, results) => {
        if (err) {-
            console.error('Error fetching group info:', err);
            return res.status(500).json({ error: 'Error fetching group info' });
        }
        res.json({ laptops: results });
    });
});

module.exports = router;
