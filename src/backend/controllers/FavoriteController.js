import Favourite from "../models/Favorite.js";

export const getAllFavorites = async (req, res) => {
  try {
    const favourites = await Favourite.getAll();
    res.json(favourites);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getFavoriteById = async (req, res) => {
  try {
    const favourite = await Favourite.getById(req.params.id);
    if (!favourite) return res.status(404).json({
      message: "Улюблене не знайдене"
    });
    res.json(favourite);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getFavoritesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favorites = await Favourite.getByUserId(userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getPlaylistTracks = async (req, res) => {
  const playlistId = req.params.id;
  const userId = req.user?.id || null;

  try {
    const playlistTracks = await Playlist.getTracks(playlistId);
    const trackIds = playlistTracks.map(t => t.id);
    let tracksWithFavorites = playlistTracks;
    if (userId) {
      tracksWithFavorites = await Favorite.getTracksWithFavorites(userId, trackIds);
    }
    res.json({
      tracks: tracksWithFavorites
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Не вдалося завантажити треки плейлісту"
    });
  }
};

export const createFavorite = async (req, res) => {
  try {
    const result = await Favourite.create(req.body);
    res.status(201).json({
      id: result.id, ...req.body
    });
  } catch (err) {
    if (err.message.includes("Вже улюблений")) {
      return res.status(400).json({
        error: err.message
      });
    }
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    await Favourite.update(req.params.id, req.body);
    res.json({
      message: "Улюблене оновлено"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const {
      user_id, track_id
    } = req.body;
    if (!user_id || !track_id) return res.status(400).json({
      error: "Потрібні user_id і track_id"
    });
    
    await Favourite.deleteByUserAndTrack(user_id, track_id);
    res.json({
      message: "Улюблене видалено"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};