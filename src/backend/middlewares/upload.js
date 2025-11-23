import multer from "multer";
import path from "path";
import fs from "fs";

const artistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/artists";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
      recursive: true
    });
    cb(null, dir);
  },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadArtistImage = multer({
  storage: artistStorage
});

const albumStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/albums";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
      recursive: true
    });
    cb(null, dir);
  },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadAlbumImage = multer({
  storage: albumStorage
});

const playlistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/playlists";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
      recursive: true
    });
    cb(null, dir);
  },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadPlaylistImage = multer({
  storage: playlistStorage
});

const trackStorage = multer.diskStorage({ destination: (req, file, cb) => {
  const dir = "uploads/tracks";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
    recursive: true
  });
  cb(null, dir);
},

filename: (req, file, cb) => {
  cb(null, Date.now() + path.extname(file.originalname));
},
});

export const uploadTrackFile = multer({
  storage: trackStorage
});