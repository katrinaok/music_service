import Playlist from "../models/playlists_model.js";

export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.getAll();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.getById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Плейліст не знайдений" });

    const tracks = await Playlist.getTracksByPlaylistId(req.params.id);

    if (playlist.cover_url && !playlist.cover_url.startsWith("/uploads")) {
      playlist.cover_url = `/uploads/${playlist.cover_url}`;
    }

    res.json({ ...playlist, tracks });
  } catch (err) {
    console.error("Серверна помилка в getPlaylistById:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPlaylistsByUser = async (req, res) => {
  try {
    const playlists = await Playlist.getByUserId(req.params.userId);

    const playlistsWithUrl = playlists.map(pl => ({
      ...pl,
      cover_url: pl.cover_url && !pl.cover_url.startsWith("/uploads")
        ? `/uploads/${pl.cover_url}`
        : pl.cover_url
    }));

    res.json(playlistsWithUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { name, user_id, description } = req.body;
    const cover_url = req.file ? `/uploads/playlists/${req.file.filename}` : null;
    const playlist = await Playlist.create({ name, user_id, description, cover_url });
    res.status(201).json(playlist);
  } catch (err) {
    console.error("Помилка створення плейліста:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    await Playlist.update(req.params.id, req.body);
    res.json({ message: "Плейліст оновлений" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    await Playlist.delete(req.params.id);
    res.json({ message: "Плейліст видалений" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};