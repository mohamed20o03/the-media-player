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
    var loadFilesButton = document.getElementById('loadFilesButton');
    var volumeRange = document.getElementById('volumeRange');

    var playlistItems = [];
    var currentFile = null;

    var wavesurfer = WaveSurfer.create({
        container: waveformContainer,
        waveColor: 'white',
        progressColor: 'aqua',
        height: 100
    });

    function loadFiles() {
        var input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'audio/*,video/*';
        input.addEventListener('change', function () {
            Array.from(input.files).forEach(function (file) {
                var item = document.createElement('div');
                item.textContent = file.name;
                item.addEventListener('click', function () {
                    playMedia(file, item);
                });
                playlist.appendChild(item);
                playlistItems.push(item);
            });
        });
        input.click();
    }

    function playMedia(file, item) {
        if (currentFile !== null) {
            if (media.style.display === 'block') {
                media.pause();
                media.src = '';
            } else if (waveformContainer.style.display === 'block') {
                wavesurfer.stop();
            }
        }

        currentFile = file;
        var isAudio = file.type.startsWith('audio');

        if (isAudio) {
            media.style.display = 'none';
            waveformContainer.style.display = 'block';
            wavesurfer.load(URL.createObjectURL(file));
            wavesurfer.on('ready', function () {
                wavesurfer.play();
            });
        } else {
            media.style.display = 'block';
            waveformContainer.style.display = 'none';
            media.src = URL.createObjectURL(file);
            media.play();
        }

        // Set volume to max
        media.volume = 1.0;
        // Set speed to 1
        speedValue.textContent = '1.0';

        updateCurrentItem(item);
    }

    function updateCurrentItem(currentItem) {
        playlistItems.forEach(function (item) {
            item.classList.remove('current');
        });
        currentItem.classList.add('current');
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

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

    function pause() {
        if (media.style.display === 'block') {
            media.pause();
        } else {
            wavesurfer.pause();
        }
    }

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

    function changeSpeed(speed) {
        speed = Math.max(0.5, Math.min(2, speed));
        if (media.style.display === 'block') {
            media.playbackRate = speed;
        } else {
            wavesurfer.setPlaybackRate(speed);
        }
        speedValue.textContent = speed.toFixed(1);
    }
    // Set initial volume to maximum
    media.volume = 1;

    // Function to change volume
    function changeVolume(volume) {
        console.log("Volume:", volume);
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

    loadFilesButton.addEventListener('click', loadFiles);
});
