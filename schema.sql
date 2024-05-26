CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY,
    playlist_cover TEXT NOT NULL,
    playlist_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    song_name TEXT NOT NULL,
    song_path TEXT NOT NULL,
    playlist_id INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);
