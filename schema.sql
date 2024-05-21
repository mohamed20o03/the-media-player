CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration NUMERIC NOT NULL,
    song_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS playlists(
    id INTEGER PRIMARY KEY,
    playlist_cover TEXT NOT NULL,
    playlist_name TEXT NOT NULL
);