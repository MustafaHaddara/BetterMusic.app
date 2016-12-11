// GLOBAL VARS
PLAYING_MUSIC = false;
REPEAT = false;
SHUFFLE = false;

var song1 = {queue:'1', name:'StereoLove'};
var song2 = {queue:'2', name:'WereInHeaven'};
var song3 = {queue:'3', name:'song2'};
var NowPlayingSong = song1;

//document.getElementById('song-title').innerText = NowPlayingSong.name;

// FUNCTIONS
function switchView(viewName) {
	document.getElementById('nav-view').style.display = 'none';
	document.getElementById('now-playing-view').style.display = 'none';
	document.getElementById('queue-view').style.display = 'none';

	document.getElementById(viewName).style.display = 'block';
}

function switchSubView(viewName) {
	// used to switch between library tabs
	document.getElementById('nav-list-view').style.display = 'none';
	document.getElementById('nav-search-view').style.display = 'none';

	document.getElementById(viewName).style.display = 'block';
}

function play() {
	// cosmetics
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0005_Pause.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/pause-button.png'
	document.getElementById('queue-mini-bar-play-button').children[0].src = 'images/pause-button.png'
	// TODO: FUNCTIONAL IMPLEMENTATION
	document.getElementById(NowPlayingSong.name).play();
	console.log('Playing music');
}

function pause() {
	// cosmetics
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0000_Play.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/play-button.png'
	document.getElementById('queue-mini-bar-play-button').children[0].src = 'images/play-button.png'
	// TODO: FUNCTIONAL IMPLEMENTATION
	document.getElementById(NowPlayingSong.name).pause();
	console.log('Pausing music');
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
	// TODO: FUNCTIONAL IMPLEMENTATION
	console.log('Skipping to next song');
	if (!(document.getElementById(NowPlayingSong.name).paused) && document.getElementById(NowPlayingSong.name).currentTime > 0) {
		document.getElementById(NowPlayingSong.name).pause();
		document.getElementById(NowPlayingSong.name).currentTime = 0;
		NowPlayingSong = song2;
		document.getElementById(NowPlayingSong.name).play();	
	} else {
		NowPlayingSong = song2;
	}
}

function prevSong() {
	// TODO: FUNCTIONAL IMPLEMENTATION
	console.log('Back to previous song');
	if (!(document.getElementById(NowPlayingSong.name).paused) && document.getElementById(NowPlayingSong.name).currentTime > 0) {
		document.getElementById(NowPlayingSong.name).pause();
		document.getElementById(NowPlayingSong.name).currentTime = 0;
		NowPlayingSong = song1;
		document.getElementById(NowPlayingSong.name).play();	
	} else {
		NowPlayingSong = song1;
	}
}

function toggleRepeat() {
	// cosmetics
	if (REPEAT) {
		document.getElementById('now-playing-repeat-button').children[0].src = 'images/icons-png/icon-_0010_RepeatOff.png';
	} else {
		document.getElementById('now-playing-repeat-button').children[0].src = 'images/icons-png/icon-_0011_RepeatOn.png';
	}
	REPEAT = !REPEAT;
	// TODO: FUNCTIONAL IMPLEMENTATION
	console.log('repeat is ' + (REPEAT? 'on':'off'));
}

function toogleShuffle() {
	// cosmetics
	if (SHUFFLE) {
		document.getElementById('now-playing-shuffle-button').children[0].src = 'images/icons-png/icon-_0012_ShuffleOff.png'
	} else {
		document.getElementById('now-playing-shuffle-button').children[0].src = 'images/icons-png/icon-_0013_ShuffleOn.png'
	}
	SHUFFLE = !SHUFFLE;
	// TODO: FUNCTIONAL IMPLEMENTATION
	console.log('shuffle is ' + (SHUFFLE? 'on':'off'));
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

document.getElementById('nav-tab-search').addEventListener('click', function() {
	switchSubView('nav-search-view')
}, false);

// NAV VIEW
document.getElementById('mini-bar-next-button').addEventListener('click', function(e) {
	nextSong();
	e.stopPropagation(); // don't let the click event propagate to the mini-bar
}, false);

document.getElementById('mini-bar-play-button').addEventListener('click', function(e) {
	togglePlay();
	e.stopPropagation();
}, false);

// NOW PLAYING VIEW
document.getElementById('now-playing-play-button').addEventListener('click', function() {
	togglePlay();
}, false);

document.getElementById('now-playing-prev-button').addEventListener('click', prevSong, false);

document.getElementById('now-playing-next-button').addEventListener('click', nextSong, false);

document.getElementById('now-playing-repeat-button').addEventListener('click', toggleRepeat, false);

document.getElementById('now-playing-shuffle-button').addEventListener('click', toogleShuffle, false);

// QUEUE VIEW
document.getElementById('queue-mini-bar-next-button').addEventListener('click', function(e) {
	nextSong();
	e.stopPropagation(); // don't let the click event propagate to the mini-bar
}, false);

document.getElementById('queue-mini-bar-play-button').addEventListener('click', function(e) {
	togglePlay();
	e.stopPropagation();
}, false);

// SEARCH VIEW
// TODO