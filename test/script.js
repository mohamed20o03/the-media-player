jQuery(function ($) {
    'use strict';

    // Audio player initialization
    var player = new Plyr('#audio1', {
        controls: [
            'restart',
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'download'
        ]
    });

    // Playlist data
    var tracks = [
        { name: 'Track 1', file: 'audio/track1.mp3' },
        { name: 'Track 2', file: 'audio/track2.mp3' },
        { name: 'Track 3', file: 'audio/track3.mp3' }
    ];

    // Build playlist
    var buildPlaylist = $.each(tracks, function (index, track) {
        $('#mainwrap').append('<div class="track"><audio id="audio1" preload="metadata" controls><source src="' + track.file + '" type="audio/mpeg"></audio></div>');
    });
});
