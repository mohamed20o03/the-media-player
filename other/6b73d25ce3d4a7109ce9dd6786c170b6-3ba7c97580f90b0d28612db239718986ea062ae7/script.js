//Using JS Audio Player Plyr

plyr.setup(document.querySelector('.plyr'));
var radio = document.querySelector('.plyr').plyr;

var player = document.querySelector('.playlist');
var playerControls = document.querySelector('.plyr__controls');
var songs = player.querySelectorAll('.playlist--list li');
var i;
var active = null;

for(i = 0; i < songs.length; i++) {
	songs[i].onclick = changeChannel;
}

setSource( getId(songs[0]), buildSource(songs[0]) );

document.querySelector('.plyr').addEventListener('ended', nextSong);

function changeChannel(e) {
	setSource( getId(e.target), buildSource(e.target), true );
  setArt(e.target);
}

function getId(el) {
	return Number(el.getAttribute('data-id'));
}

function buildSource(el) {
	var obj = [{
		src: el.getAttribute('data-audio'),
    image: el.getAttribute('data-image'),
    artist: el.getAttribute('data-artist'),
		type: 'audio/ogg'
	}];
  
  console.log(obj[0].image);

	return obj;
}

function setSource(selected, sourceAudio, play) {
	if(active !== selected) {
		active = selected;
    playerControls.style.background = "linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.99) 100%), url("+sourceAudio[0].image+")";
		radio.source({
			type: 'audio',
			title: 'test',
      poster: sourceAudio[0].image,
			sources: sourceAudio
		});

		for(var i = 0; i < songs.length; i++) {
			if(Number(songs[i].getAttribute('data-id')) === selected) {
				songs[i].className = 'active';
			} else {
				songs[i].className = '';
			}
		}

		if(play) {
			radio.play();
		}
	} else {
		radio.togglePlay();
	}
}

function setArt(e) {
  console.log(e);
}

function nextSong(e) {
	var next = active + 1;

	if(next < songs.length) {
		setSource( getId(songs[next]), buildSource(songs[next]), true );
	}
}