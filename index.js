// index.js
const express = require('express');
const db = require('./db/db');
const alumnosRouter = require('./routes/alumnos');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const studentsRouter = require('./routes/students');
const gruposRouter = require('./routes/grupos');
const asistenciaRouter = require('./routes/asistencia');
const laptopsRouter = require('./routes/laptops');


const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router de cada ruta
app.use('/api', alumnosRouter);
app.use('/api', loginRouter);
app.use('/api', dashboardRouter);
app.use('/api', studentsRouter);
app.use('/api', gruposRouter);
app.use('/api', asistenciaRouter);
app.use('/api', laptopsRouter);



app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor web escuchando en http://localhost:${port}`);
});
