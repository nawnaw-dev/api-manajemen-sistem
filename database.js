require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = process.env.DB_SOURCE || "movies.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Terhubung ke basis data SQLite.');

        db.run(`CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            director TEXT NOT NULL,
            year INTEGER NOT NULL
        )`, (err) => {
            if (err) {
                return console.error("Gagal membuat tabel movies:", err.message);
            }

            db.get("SELECT COUNT(*) as count FROM movies", (err, row) => {
                if (err) {
                    return console.error(err.message);
                }

                if (row.count === 0) {
                    console.log("Menambahkan data awal ke tabel movies...");
                    const insert = 'INSERT INTO movies(title, director, year) VALUES(?, ?, ?)';
                    db.run(insert, ["Parasite", "Bong Joon-ho", 2019]);
                    db.run(insert, ["The Dark Knight", "Christopher Nolan", 2008]);
                    db.run(insert, ["Inception", "Christopher Nolan", 2010]);
                }
            });
        });
    }
});

module.exports = db;