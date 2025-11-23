import Track from "../models/Track.js";

export const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.getAll();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getTrackById = async (req, res) => {
  try {
    const track = await Track.getById(req.params.id);
    if (!track) return res.status(404).json({
      message: "Трек не знайдений"
    });
    res.json(track);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const createTrack = async (req, res) => {
  try {
    const {
      title, artist_id, album_id, genre_id
    } = req.body;
    
    const file_path = req.file ? req.file.path : null;
    
    const result = await Track.create({
      title, artist_id, album_id, genre_id, file_path
    });
    res.status(201).json({
      id: result.id, title, artist_id, album_id, genre_id, file_path
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateTrack = async (req, res) => {
  try {
    await Track.update(req.params.id, req.body);
    res.json({
      message: "Трек оновлений"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const deleteTrack = async (req, res) => {
  try {
    await Track.delete(req.params.id);
    res.json({
      message: "Трек видалений"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};