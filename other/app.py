from flask import Flask, request, render_template

app = Flask(__name__)

# Global list to store uploaded filenames
uploaded_files = []

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/songs')
def songs():
    return render_template('songs.html',uploaded_files=uploaded_files)

@app.route('/upload', methods=['POST'])
def upload():
    if 'musicFile' not in request.files:
        return 'No file part'

    file = request.files['musicFile']

    if file.filename in uploaded_files:
        return render_template('upload_error.html', message='File already exists')
    else:
        uploaded_files.append(file.filename)
        return render_template('upload_success.html', filename=file.filename)

if __name__ == '__main__':
    app.run(debug=True)
