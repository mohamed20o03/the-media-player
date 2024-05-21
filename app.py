from flask import Flask, render_template, request , jsonify , g
import os , sqlite3
from db import SQLiteDB 

app = Flask(__name__, static_url_path='/static')



DATABASE = 'songs.db'
SCHEMAFILE = "schema.sql"
UPLOAD_FOLDER = 'static/'
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




@app.route('/audio_list')
def audio_list():
    pass
    




if __name__ == '__main__':
    app.run(debug=True)
