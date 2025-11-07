require('dotenv').config();
const db = require('./database.js');
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/status', (req, res) => {
    res.json({ message: 'API is running' });
});

app.get('/movies', (req, res) => {
    const sql = "SELECT * FROM movies ORDER BY id ASC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
