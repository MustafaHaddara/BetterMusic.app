// STYLES
// document.getElementById('now-playing-pause-button').style.display = 'none';
document.getElementById('now-playing-repeat-on-button').style.display = 'none';
document.getElementById('now-playing-shuffle-on-button').style.display = 'none';


// GLOBAL VARS
PLAYING_MUSIC = false;

// FUNCTIONS
function switchView(viewName) {
	document.getElementById('nav-view').style.display = 'none';
	document.getElementById('now-playing-view').style.display = 'none';
	document.getElementById('queue-view').style.display = 'none';
	document.getElementById('search-view').style.display = 'none';

	document.getElementById(viewName).style.display = 'unset';
}

function play() {
	console.log('Playing music');
	// icons
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0005_Pause.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/pause-button.png'
}

function pause() {
	console.log('Pausing music');
	// icons
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0000_Play.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/play-button.png'
}

function togglePlay() {
	if (PLAYING_MUSIC) {
		pause();
	} else {
		play();
	}
	PLAYING_MUSIC = !PLAYING_MUSIC;
}

function nextSong() {
	console.log('Skipping to next song');
}

function prevSong() {
	console.log('Back to previous song');
}

// EVENT LISTENERS
// TRANSITIONS
document.getElementById('now-playing-close-button').addEventListener('click', function() {
	switchView('nav-view');
}, false);

document.getElementById('mini-bar').addEventListener('click', function() {
	switchView('now-playing-view');
}, false);

document.getElementById('now-playing-queue-button').addEventListener('click', function() {
	switchView('queue-view');
}, false);

document.getElementById('queue-close-button').addEventListener('click', function() {
	switchView('now-playing-view');
}, false);

// NAV VIEW
document.getElementById('mini-bar-next-button').addEventListener('click', nextSong, false);

document.getElementById('mini-bar-play-button').addEventListener('click', function() {
	togglePlay();
}, false);

// NOW PLAYING VIEW
document.getElementById('now-playing-play-button').addEventListener('click', function() {
	togglePlay();
}, false);

document.getElementById('now-playing-prev-button').addEventListener('click', prevSong, false);

document.getElementById('now-playing-next-button').addEventListener('click', nextSong, false);

document.getElementById('now-playing-repeat-off-button').addEventListener('click', function() {
	document.getElementById('now-playing-repeat-off-button').style.display = 'none';
	document.getElementById('now-playing-repeat-on-button').style.display = 'unset';
}, false);

document.getElementById('now-playing-repeat-on-button').addEventListener('click', function() {
	document.getElementById('now-playing-repeat-on-button').style.display = 'none';
	document.getElementById('now-playing-repeat-off-button').style.display = 'unset';
}, false);

document.getElementById('now-playing-shuffle-off-button').addEventListener('click', function() {
	document.getElementById('now-playing-shuffle-off-button').style.display = 'none';
	document.getElementById('now-playing-shuffle-on-button').style.display = 'unset';
}, false);

document.getElementById('now-playing-shuffle-on-button').addEventListener('click', function() {
	document.getElementById('now-playing-shuffle-on-button').style.display = 'none';
	document.getElementById('now-playing-shuffle-off-button').style.display = 'unset';
}, false);

// QUEUE VIEW