CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration NUMERIC NOT NULL,
    song_path TEXT NOT NULL
);
