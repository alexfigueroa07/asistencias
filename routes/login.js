const express = require('express');
const router = express.Router();
const db = require('../db/db');
const session = require('express-session');

router.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const query = 'SELECT * FROM usuario WHERE nombre = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }

        if (results.length > 0) {
           
            const userId = results[0].id;
            req.session.user = {
                id: userId,
                username: results[0].nombre
            };
            return res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                userId: userId 
            });
        } else {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

router.get('/session', (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    } else {
        return res.status(401).json({ error: 'No has iniciado sesión' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        return res.json({ message: 'Cierre de sesión exitoso' });
    });
});

router.get('/api/professor', (req, res) => {
    const userId = req.session.userId; 

    const query = `
        SELECT profesor.nombre AS nombre_profesor
        FROM profesor
        JOIN usuario ON profesor.id_usuario = usuario.id
        WHERE usuario.id = ?`;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching professor name:', error);
            res.status(500).json({ error: 'Error al obtener el nombre del profesor' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Profesor no encontrado' });
            return;
        }

        res.json({ professor_name: results[0].nombre_profesor });
    });
});


module.exports = router;
