import Artist from "../models/artists_model.js";

export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.getAll();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.getById(req.params.id);
    if (!artist) return res.status(404).json({ message: "Виконавець не знайдений" });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createArtist = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) return res.status(400).json({ error: "Ім'я виконавця обов'язкове" });
    
    const image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

    const result = await Artist.create({ name, bio, image_url });
    res.status(201).json({ id: result.id, name, bio, image_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateArtist = async (req, res) => {
  try {
    await Artist.update(req.params.id, req.body);
    res.json({ message: "Виконавець оновлений" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteArtist = async (req, res) => {
  try {
    await Artist.delete(req.params.id);
    res.json({ message: "Виконавець видалений" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};