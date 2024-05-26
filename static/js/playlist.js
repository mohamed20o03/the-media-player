document.addEventListener('DOMContentLoaded', function () {
    var media = document.getElementById('media');
    var waveformContainer = document.getElementById('waveform');
    var playlist = document.getElementById('playlist');
    var playButton = document.getElementById('playButton');
    var pauseButton = document.getElementById('pauseButton');
    var prevButton = document.getElementById('prevButton');
    var nextButton = document.getElementById('nextButton');
    var speedUpButton = document.getElementById('speedUpButton');
    var speedDownButton = document.getElementById('speedDownButton');
    var speedValue = document.getElementById('speedValue');
    var openUploadPopup = document.getElementById('openUploadPopup');
    var closeUploadPopup = document.getElementById('closeUploadPopup');
    var uploadButton = document.getElementById('uploadButton');
    var cancelUploadButton = document.getElementById('cancelUploadButton');
    var fileInput = document.getElementById('fileInput');
    var fileNameInput = document.getElementById('fileNameInput');
    var volumeRange = document.getElementById('volumeRange');

    var playlistItems = [];
    var currentFile = null;

    var wavesurfer = WaveSurfer.create({
        container: waveformContainer,
        waveColor: 'white',
        progressColor: 'aqua',
        height: 100
    });

    // Function to upload file to Flask
    function uploadFile(file, fileName, playlistName) {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('file_name', fileName);
        formData.append('playlist_name', playlistName);
        console.log(file + " " + fileName + " " + playlistName);
        fetch('/upload_song', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Fetch updated playlist data from Flask
            fetchPlaylistData();
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            // Handle error, e.g., display an error message to the user
        });
    }

    // Function to fetch playlist data from Flask
    function fetchPlaylistData() {
        // Get the playlist name from the URL
        var url = new URL(window.location.href);
        // Fetch playlist data from Flask route
        fetch('/playlist/' + playlist_name)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Playlist not found');
                }
                return response.json();
            })
            .then(data => {
                // Clear existing playlist items
                playlist.innerHTML = '';

                // Create playlist items from fetched data
                data.forEach(item => {
                    createPlaylistItem(item[0], item[1] , item[2]);
                });
            })
            .catch(error => {
                console.error('Error fetching playlist data:', error);
                // Handle error, e.g., display an error message to the user
            });
    }

    // Function to create playlist item
    function createPlaylistItem(name, path,type) {
        var item = document.createElement('div');
        item.textContent = name;
        item.addEventListener('click', function () {
            playMedia(path, item, type);
        });
        playlist.appendChild(item);
        playlistItems.push(item);
    }

    // Event listener for upload button
    uploadButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        var file = fileInput.files[0];
        var fileName = fileNameInput.value;

        if (file && playlist_name) {
            // Upload file to Flask with playlist name and file name
            uploadFile(file, fileName, playlist_name);
            document.getElementById('uploadPopup').style.display = 'none';
        } else {
            console.error('File or playlist name is missing');
            // Handle error, e.g., display an error message to the user
        }
    });

    // Event listener for opening the upload popup
    openUploadPopup.addEventListener('click', function () {
        document.getElementById('uploadPopup').style.display = 'block';
    });

    // Event listener for closing the upload popup
    closeUploadPopup.addEventListener('click', function () {
        document.getElementById('uploadPopup').style.display = 'none';
    });

    // Event listener for cancel button in upload popup
    cancelUploadButton.addEventListener('click', function () {
        document.getElementById('uploadPopup').style.display = 'none';
    });

    // Function to play media
    function playMedia(path, item , type) {
        if (currentFile !== null) {
            if (media.style.display === 'block') {
                media.pause();
                media.src = '';
            } else if (waveformContainer.style.display === 'block') {
                wavesurfer.stop();
            }
        }
  
        currentFile = "/" + path;
        var isAudio = (type == 'audio');

        if (isAudio) {
            media.style.display = 'none';
            waveformContainer.style.display = 'block';
            wavesurfer.load(currentFile);
            wavesurfer.on('ready', function () {
                wavesurfer.play();
            });
        } else {
            media.style.display = 'block';
            waveformContainer.style.display = 'none';
            media.src = currentFile;
            media.play();
        }

        // Set volume to max
        media.volume = 1.0;
        // Set speed to 1
        speedValue.textContent = '1.0';

        updateCurrentItem(item);
    }

    // Function to update the current item
    function updateCurrentItem(currentItem) {
        playlistItems.forEach(function (item) {
            item.classList.remove('current');
        });
        currentItem.classList.add('current');
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Function to play the media
    function play() {
        if (media.style.display === 'block') {
            media.play();
        } else {
            wavesurfer.play();
        }
        if (!currentFile && playlistItems.length > 0) {
            playlistItems[0].click();
        }
    }

    // Function to pause the media
    function pause() {
        if (media.style.display === 'block') {
            media.pause();
        } else {
            wavesurfer.pause();
        }
    }

    // Function to play the previous item in the playlist
    function prev() {
        var currentIndex = playlistItems.findIndex(item => item.classList.contains('current'));
        if (currentIndex !== -1) {
            playlistItems[currentIndex].classList.remove('current');
        }
        var prevIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
        playlistItems[prevIndex].classList.add('current');
        playlistItems[prevIndex].click();
        playlistItems[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Function to play the next item in the playlist
    function next() {
        var currentIndex = playlistItems.findIndex(item => item.classList.contains('current'));
        if (currentIndex !== -1) {
            playlistItems[currentIndex].classList.remove('current');
        }
        var nextIndex = (currentIndex + 1) % playlistItems.length;
        playlistItems[nextIndex].classList.add('current');
        playlistItems[nextIndex].click();
        playlistItems[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Function to change the playback speed
    function changeSpeed(speed) {
        speed = Math.max(0.5, Math.min(2, speed));
        if (media.style.display === 'block') {
            media.playbackRate = speed;
        } else {
            wavesurfer.setPlaybackRate(speed);
        }
        speedValue.textContent = speed.toFixed(1);
    }

    // Function to change the volume
    function changeVolume(volume) {
        if (media.style.display === 'block') {
            media.volume = volume;
        } else {
            wavesurfer.setVolume(volume);
        }
    }

    playButton.addEventListener('click', play);
    pauseButton.addEventListener('click', pause);
    prevButton.addEventListener('click', prev);
    nextButton.addEventListener('click', next);

    speedUpButton.addEventListener('click', function () {
        changeSpeed((media.style.display === 'block' ? media.playbackRate : wavesurfer.getPlaybackRate()) + 0.1);
    });

    speedDownButton.addEventListener('click', function () {
        changeSpeed((media.style.display === 'block' ? media.playbackRate : wavesurfer.getPlaybackRate()) - 0.1);
    });

    volumeRange.addEventListener('input', function () {
        changeVolume(parseFloat(volumeRange.value));
    });

    // Initial fetch of playlist data
    fetchPlaylistData();
});
