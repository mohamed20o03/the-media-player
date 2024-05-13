from flask import Flask, render_template, request , jsonify
import os , sqlite3


app = Flask(__name__)

from mutagen.mp3 import MP3


def get_song_length(file_path):
    if file_path.endswith('.mp3'):
        audio = MP3(file_path)
        return audio.info.length  # Length in seconds
    else:
        raise ValueError('Unsupported audio format')




UPLOAD_FOLDER = 'audio/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def create_connection():
    conn = sqlite3.connect('songs.db')
    return conn

# Function to create the songs table by executing queries from a SQL file
def create_table():
    conn = create_connection()
    cursor = conn.cursor()
    with open('schema.sql', 'r') as f:
        schema_queries = f.read()
        cursor.executescript(schema_queries)
    conn.commit()
    conn.close()

# Function to add a song to the database
def add_song(title, artist,song_path):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO songs (title, artist, duration, song_path) VALUES (?, ?, ?, ?)", 
                   (title, artist, get_song_length(song_path) / 60 ,song_path))
    conn.commit()
    conn.close()

# Function to get all songs from the database
def get_songs():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM songs")
    songs = cursor.fetchall()
    conn.close()
    return songs

# Create table on startup
create_table()




@app.route('/')
def index():
    return render_template('form.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'audio_file' not in request.files:
        return 'No file part'
    
    file = request.files['audio_file']

    if file.filename == '':
        return 'No selected file'
   
    song_name = request.form['song_name']
    singer_name = request.form['singer_name']


    # Ensure the song name is not empty
    if not song_name.strip() or not singer_name.strip():
        return 'Please enter a valid song name'

    # Get the file extension
    file_extension = os.path.splitext(file.filename)[1]
    song_path = app.config['UPLOAD_FOLDER'] + f"{song_name}{file_extension}"

     # Save the file to a folder with the provided song name and the original file extension
    file.save( song_path )


    # store in data base
    add_song(song_name,singer_name,song_path)



    return f'{song_name} for {singer_name} uploaded successfully'


@app.route('/audio_list')
def audio_list():
    songs_list = get_songs()
    return jsonify(songs_list)




if __name__ == '__main__':
    app.run(debug=True)
