import Album from "../models/Album.js";

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.getAll();
    res.json(albums);
  } catch (err) {
    res.status(500).json({
      error: err.message 
    });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.getById(req.params.id);
    if (!album) return res.status(404).json({
      message: "Альбом не знайдений"
    });
    res.json(album);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const cover_url = req.file ? `/uploads/albums/${req.file.filename}` : null;
    const {
      title, artist_id, year
    } = req.body;
    
    const newAlbum = {
      title, artist_id, release_year: year, cover_url
    };
    
    const result = await Album.create(newAlbum);
    res.status(201).json({
      id: result.id, ...newAlbum
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const cover_image = req.file ? `/uploads/${req.file.filename}` : req.body.cover_image;
    await Album.update(req.params.id, {
      ...req.body, cover_image
    });
    res.json({
      message: "Альбом оновлений"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    await Album.delete(req.params.id);
    res.json({
      message: "Альбом видалений"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};