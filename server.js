const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3200;

let idSeq = 3;

let movies = [
  { id: 1, tittle: "Parasite", director: "Bong Joon-ho", year: "2019" },
  { id: 2, tittle: "The Dark Knight", director: "Nolan", year: "2008" },
];

let directors = [
  {id: 1, nama: "Bong Joon-ho", birthYear: "1987"},
  {id: 2, nama: "Nolan", birthYear: "1976"},
];

//===MIDDLEWARE===
app.use(cors());

app.use(express.json());

//===ROUTES===
app.get("/status", (req, res) => {
  res.json({
    ok: true,
    service: "film-api",
    time: new Date().toISOString(),
  });
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/directors", (req, res) => {
  res.json(directors);
});

app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);
  if (!movie) return res.status(404).json({ error: "Movie tidak ditemukan" });
  res.json(movie);
});

app.get("/directors/:id", (req, res) => {
  const id = Number(req.params.id);
  const director = directors.find((m) => m.id === id);
  if (!director) return res.status(404).json({ error: "Direktor tidak ditemukan" });
  res.json(director);
});

//POST /movies - membuat film baru
app.post("/movies", (req, res) => {
  const { tittle, director, year } = req.body || {};
  if (!tittle || !director || !year) {
    return res
      .status(400)
      .json({ error: "tittle, director, year wajib diisi" });
  }
  const newMovie = { id: idSeq++, tittle, director, year };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

//PUT /movies/:id - Memperbarui data film
app.put("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movieIndex = movies.findIndex((m) => m.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie tidak ditemukan" });
  }
  const { tittle, director, year } = req.body || {};
  const updatedMovie = { id, tittle, director, year };
  movies[movieIndex] = updatedMovie;
  res.json(updatedMovie);
});

//DELETE /movies/id: -Menghapus film
app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movieIndex = movies.findIndex((m) => m.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie tidak ditemukan" });
  }
  movies.splice(movieIndex, 1);
  res.status(204).send();
});

//POST /directors - menambahkan director baru
app.post("/directors", (req, res) => {
  const { nama, birthYear } = req.body || {};
  if (!nama || !birthYear) {
    return res
      .status(400)
      .json({ error: "Nama, birthYear wajib diisi" });
  }
  const newDirec = { id: idSeq++, nama, birthYear };
  directors.push(newDirec);
  res.status(201).json(newDirec);
});


//Middleware fallback untuk menanganii rute 404 not found
app.use((req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});

//Error handle terpusat
app.use((err, req, res, _next) => {
    console.error('[ERROR]', err);
    res.status(500).json({error: 'Terjadi kesalahan pada server'});
});

//Start server
app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
