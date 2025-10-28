import PlaylistTrack from "../models/playlist_tracks_model.js";

export const getAllPlaylistTracks = async (req, res) => {
  try {
    const tracks = await PlaylistTrack.getAll();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaylistTracks = async (req, res) => {
  try {
    const playlist_id = parseInt(req.params.playlistId);
    if (isNaN(playlist_id)) return res.status(400).json({ error: "Некоректний playlist_id" });

    const tracks = await PlaylistTrack.getByPlaylistId(playlist_id);
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не вдалося завантажити треки плейліста" });
  }
};

export const addTrackToPlaylist = async (req,res)=>{
  try {
    const playlist_id = parseInt(req.params.playlistId);
    const track_id = parseInt(req.body.track_id);
    if(isNaN(playlist_id)||isNaN(track_id)) return res.status(400).json({error:"Некоректний playlist_id або track_id"});
    await PlaylistTrack.create(playlist_id, track_id);
    res.status(201).json({playlist_id, track_id});
  } catch(err){
    console.error(err);
    res.status(500).json({error:err.message});
  }
};

export const deleteTrackFromPlaylist = async (req, res) => {
  try {
    const playlist_id = parseInt(req.params.playlistId);
    const track_id = parseInt(req.params.trackId);

    if (isNaN(playlist_id) || isNaN(track_id)) {
      return res.status(400).json({ error: "Некоректний playlist_id або track_id" });
    }

    await PlaylistTrack.delete(playlist_id, track_id);
    res.json({ message: "Трек видалено з плейліста" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}