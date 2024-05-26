from flask import Flask, render_template, request , jsonify , g
import os , sqlite3
from db import SQLiteDB 
from werkzeug.utils import secure_filename


app = Flask(__name__, static_url_path='/static')



DATABASE = 'songs.db'
SCHEMAFILE = "schema.sql"
UPLOAD_FOLDER = 'static/data'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



def get_db():
    if 'db' not in g:
        g.db = SQLiteDB(DATABASE,SCHEMAFILE)
        g.db._connect()
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db._disconnect()




@app.route('/')
def intro():
    return render_template('intro.html')


@app.route('/playlists')
def playlists():
    return render_template('playlists.html')


@app.route('/upload_song', methods=['POST'])
def upload_song():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    playlist_name = request.form.get('playlist_name')
    file_name = request.form.get('file_name', file.filename)

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and playlist_name:
        filename = secure_filename(file_name)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

    if 'audio' in file.content_type:
        file_type = 'audio'
    else:
        file_type = 'video'
   
    db = get_db()
    playlist_id = str( db.fetch_one("SELECT id FROM playlists WHERE playlist_name = ?", (playlist_name,)) )
    print(type(playlist_id))
    db.execute_query("INSERT INTO songs (song_name, song_path, playlist_id , file_type) VALUES (?, ?, ?, ?)",(filename,file_path,playlist_id,file_type))          
    return "true"

@app.route('/playlists/<playlist_name>', methods=['GET'])
def playlist_page(playlist_name):
    return render_template('playlist.html' , playlist_name = playlist_name)

@app.route('/playlist/<playlist_name>')
def playlist_by_name(playlist_name):
    db = get_db()

    playlist_id = str ( db.fetch_one("SELECT id FROM playlists WHERE playlist_name = ?", (playlist_name,)) )

    songs = db.fetch_all("SELECT song_name, song_path, file_type FROM songs WHERE playlist_id = ?",(playlist_id,))
    return jsonify(songs)


@app.route('/get_playlists', methods=['GET'])
def get_playlists():
    db = get_db()
    return jsonify(db.fetch_all("SELECT playlist_cover , playlist_name FROM playlists"))

@app.route('/add_playlist', methods=['POST'])
def add_playlist():
    if 'playlistCover' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    playlist_cover = request.files['playlistCover']
    if playlist_cover.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    playlist_name = request.form.get('playlist_name')
    if not playlist_name or not playlist_name.strip():
        return jsonify({'error': 'Please enter a valid playlist name'}), 400

    playlist_cover_extension = os.path.splitext(playlist_cover.filename)[1]
    playlist_cover_path = os.path.join( app.config['UPLOAD_FOLDER'], f"{playlist_name}_cover{playlist_cover_extension}")
    playlist_cover.save(playlist_cover_path)

    db = get_db()
    db.execute_query("INSERT INTO playlists (playlist_cover, playlist_name) VALUES (?,?)", (playlist_cover_path,playlist_name) )
    
    new_playlist = [ playlist_cover_path , playlist_name]
    return jsonify(new_playlist)


if __name__ == '__main__':
    app.run(debug=True)
