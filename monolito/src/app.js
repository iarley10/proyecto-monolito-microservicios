const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

// ==========================================
// RUTA PRINCIPAL DE PRUEBA
// ==========================================

app.get('/health', (req, res) => {
    res.json({
        estado: 'ok',
        mensaje: 'Servidor funcionando correctamente'
    });
});

// ==========================================
// PRUEBA DE CONEXIÓN CON POSTGRESQL
// ==========================================

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            estado: 'ok',
            mensaje: 'Conexión con PostgreSQL correcta',
            fecha: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            estado: 'error',
            mensaje: 'No se pudo conectar con PostgreSQL'
        });
    }
});

// ==========================================
// OBTENER USUARIOS
// ==========================================

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios ORDER BY id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            estado: 'error',
            mensaje: 'Error al consultar usuarios'
        });
    }
});

// ==========================================
// OBTENER PRODUCTOS
// ==========================================

app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM productos ORDER BY id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            estado: 'error',
            mensaje: 'Error al consultar productos'
        });
    }
});

// ==========================================
// OBTENER PEDIDOS
// ==========================================

app.get('/pedidos', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM pedidos ORDER BY id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            estado: 'error',
            mensaje: 'Error al consultar pedidos'
        });
    }
});

// ==========================================
// EXPORTAR APLICACIÓN
// ==========================================

module.exports = app;
