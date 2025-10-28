import Genre from "../models/genres_model.js";

export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.getAll();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.getById(req.params.id);
    if (!genre) return res.status(404).json({ message: "Жанр не знайдений" });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createGenre = async (req, res) => {
  try {
    const result = await Genre.create(req.body);
    res.status(201).json({ id: result.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGenre = async (req, res) => {
  try {
    await Genre.update(req.params.id, req.body);
    res.json({ message: "Жанр оновлений" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    await Genre.delete(req.params.id);
    res.json({ message: "Жанр видалений" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};