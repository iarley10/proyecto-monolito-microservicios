const express = require('express');
const pool = require('./db');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ estado: 'error', servicio: 'monolito' });
});

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar usuarios' });
    }
});

app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar productos' });
    }
});

app.get('/pedidos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar pedidos' });
    }
});

// Operaciones POST, PUT y DELETE
app.post('/usuarios', async (req, res) => {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({
            error: 'Nombre y email son obligatorios'
        });
    }

    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
            [nombre, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const { nombre, email } = req.body;
    const { id } = req.params;

    if (!nombre || !email) {
        return res.status(400).json({
            error: 'Nombre y email son obligatorios'
        });
    }

    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *',
            [nombre, email, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            mensaje: 'Usuario eliminado',
            usuario: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({
                error: 'No se puede eliminar porque tiene pedidos asociados'
            });
        }

        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = app;
