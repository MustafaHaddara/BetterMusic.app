// GLOBAL VARS
var PLAYING_MUSIC = false;
var REPEAT = false;
var SHUFFLE = false;
var LIST_VIEW_MODE = 'song'
var NOW_PLAYING_SONG = 0;
var SONG_QUEUE = [0,1,1,0,1];

document.addEventListener("DOMContentLoaded", function(event) {
	filterBy('song'); // initial default state
});

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
	document.getElementById('nav-header').innerText = (viewName=='nav-list-view' ? (LIST_VIEW_MODE + 's') : 'Search');
}

function updateNowPlayingSongInformation() {
	document.getElementById('now-playing-song-title').innerText = SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].name;
	document.getElementById('now-playing-song-details').innerText = SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].artist + ' - ' + SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].album;
	document.getElementById('mini-bar-song-title').innerText = SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].name;
	document.getElementById('mini-bar-song-details').innerText = SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].artist + ' - ' + SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].album;
}

function play() {
	// cosmetics
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0005_Pause.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/pause-button.png'
	document.getElementById('queue-mini-bar-play-button').children[0].src = 'images/pause-button.png'
	// functionality
	document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).play();
	console.log('Playing music');
	updateNowPlayingSongInformation();
}

function pause() {
	// cosmetics
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0000_Play.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/play-button.png'
	document.getElementById('queue-mini-bar-play-button').children[0].src = 'images/play-button.png'
	// functionality
	document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).pause();
	console.log('Pausing music');
	updateNowPlayingSongInformation();
}

function togglePlay() {
	if (PLAYING_MUSIC) {
		pause();
	} else {
		play();
	}
	PLAYING_MUSIC = !PLAYING_MUSIC;
}

function playSongById(songId) {
	pause(); // stop current song
	// find index of song
	for (var i=0; i<SONGS.length; i++) {
		if (SONGS[i].id == songId) {
			SONG_QUEUE = [i];
			NOW_PLAYING_SONG = 0;
			break;
		}
	}
	// start from beginning
	document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).currentTime = 0;
	play();
}

function nextSong() {
	console.log('Skipping to next song');
	if (!(document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).paused) && document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).currentTime > 0) {
		document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).pause();
		document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).currentTime = 0;
		NOW_PLAYING_SONG++;
		document.getElementById('now-playing-song-title').innerText = SONGS[NOW_PLAYING_SONG].name;
		document.getElementById('now-playing-song-details').innerText = SONGS[NOW_PLAYING_SONG].artist + ' – ' + SONGS[NOW_PLAYING_SONG].album;
		document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).play();
	} else {
		NOW_PLAYING_SONG++;
	}
	updateNowPlayingSongInformation();
}

function prevSong() {
	console.log('Back to previous song');

	if (!(document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).paused) && document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).currentTime > 0) {
		document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).pause();
		document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).currentTime = 0;
		NOW_PLAYING_SONG--;
		document.getElementById('now-playing-song-title').innerText = SONGS[NOW_PLAYING_SONG].name;
		document.getElementById('now-playing-song-details').innerText = SONGS[NOW_PLAYING_SONG].artist + ' – ' + SONGS[NOW_PLAYING_SONG].album;
		document.getElementById(SONGS[SONG_QUEUE[NOW_PLAYING_SONG]].id).play();
	} else {
		NOW_PLAYING_SONG--;
	}
	updateNowPlayingSongInformation();
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

// TODO add a back button from search results
function searchBy(searchTerm) {
	// populate this listview
	var listView = document.getElementById('nav-list-view');
	listView.innerHTML = ""  // clear the list

	// create the set of items to display (set so we don't display the same album/artist/genre twice)
	var result = new Set();  // EC6 only
	for(var i = 0; i < SONGS.length; i++) {  // TODO why do we only get one thing out?
		var song = SONGS[i];
		if (result.has(song['name'])) {
			continue;
		}
		// really basic search implementation but it'll do
		var st = searchTerm.toLowerCase()
		if (song['name'].toLowerCase().startsWith(st) || 
			song['album'].toLowerCase().startsWith(st) || 
			song['artist'].toLowerCase().startsWith(st)) {
			result.add(song['name']);
			var song = buildSongListItem(song, 'song');
			listView.appendChild(song);
		}
	}
	switchSubView('nav-list-view'); // go to list view
	document.getElementById('nav-header').innerText = "Search for: " + searchTerm ;
}

// filter our songs according to a mode (ie. attribute)
// optionally accept a secondFilter which will further restrict
// our search results
function filterBy(mode, secondFilter) {
	// set the global mode (we'll use this for navigation)
	LIST_VIEW_MODE = mode;
	setHeader(mode + 's') ;
	var key = (mode=='song'? 'name': mode);

	// populate this listview
	var listView = document.getElementById('nav-list-view');
	listView.innerHTML = ""  // clear the list

	// create the set of items to display (set so we don't display the same album/artist/genre twice)
	var result = new Set();  // EC6 only
	for(var i = 0; i < SONGS.length; i++) {  // TODO why do we only get one thing out?
		var song = SONGS[i];
		if (result.has(song[key])) {
			continue;
		}
		if (secondFilter && !secondFilter(song)) {
			// if the second filter is defined 
			// and this song doesn't pass that filter
			continue;
		}
		result.add(song[key]);
		var song = buildSongListItem(song, LIST_VIEW_MODE);
		listView.appendChild(song);
	}
	switchSubView('nav-list-view'); // go to library
}

function buildSongListItem(songObj, mode) {
	var el = document.createElement('li');
	var clickCallback = function() {
		console.log('No callback implemented');
	}
	if (mode == 'song') {
		var title = document.createElement('span');
		title.innerText = songObj['name'];
		title.style.fontSize = '16pt';
		title.style.fontWeight = 'Bold';
		title.style.flexGrow = 2;
		el.appendChild(title);

		var artist = document.createElement('span');
		artist.innerText = songObj['artist'];
		artist.style.fontSize = '12pt';
		el.appendChild(artist);
		clickCallback = function() {
			playSongById(songObj['id']);
		}
	} else {
		// create list node
		var value = songObj[mode];
		el.appendChild(document.createTextNode(value));

		// create callback
		var secondFilter = function(obj) { 
			return obj[mode] == value;
		}
		if (mode == 'genre') {
			clickCallback = function() {
				filterBy('artist', secondFilter);
				setHeader(value);
			}
		} else if (mode == 'artist') {
			clickCallback = function() {
				filterBy('album', secondFilter);
				setHeader(value);
			}
		} else if (mode == 'album') {
			clickCallback = function() {
				filterBy('song', secondFilter);
				setHeader(value);
			}
		}
	}
	el.addEventListener('click', clickCallback);
	return el;
}

function setHeader(newText) {
	document.getElementById('nav-header').innerText = newText;
}

// EVENT LISTENERS
// TRANSITIONS
document.getElementById('now-playing-close-button').addEventListener('click', function() {
	switchView('nav-view');
});

document.getElementById('mini-bar').addEventListener('click', function() {
	switchView('now-playing-view');
});

document.getElementById('now-playing-queue-button').addEventListener('click', function() {
	switchView('queue-view');
});

document.getElementById('queue-close-button').addEventListener('click', function() {
	switchView('now-playing-view');
});

document.getElementById('nav-tab-artists').addEventListener('click', function() {
	filterBy('artist');
});

document.getElementById('nav-tab-songs').addEventListener('click', function() {
	filterBy('song');
});

document.getElementById('nav-tab-albums').addEventListener('click', function() {
	filterBy('album');
});

document.getElementById('nav-tab-genre').addEventListener('click', function() {
	filterBy('genre');
});

document.getElementById('nav-tab-search').addEventListener('click', function() {
	switchSubView('nav-search-view'); // go to search view
});

document.getElementById('search-view-lib-button').addEventListener('click', function() {
	switchSubView('nav-list-view'); // go to library
});

// NAV VIEW
document.getElementById('search-button').addEventListener('click', function() {
	searchBy(document.getElementById('search-input').value);
});

document.getElementById('mini-bar-next-button').addEventListener('click', function(e) {
	nextSong();
	e.stopPropagation(); // don't let the click event propagate to the mini-bar
});

document.getElementById('mini-bar-play-button').addEventListener('click', function(e) {
	togglePlay();
	e.stopPropagation();
});

// NOW PLAYING VIEW
document.getElementById('now-playing-play-button').addEventListener('click', function() {
	togglePlay();
});

document.getElementById('now-playing-prev-button').addEventListener('click', prevSong);

document.getElementById('now-playing-next-button').addEventListener('click', nextSong);

document.getElementById('now-playing-repeat-button').addEventListener('click', toggleRepeat);

document.getElementById('now-playing-shuffle-button').addEventListener('click', toogleShuffle);

// QUEUE VIEW
document.getElementById('queue-mini-bar-next-button').addEventListener('click', function(e) {
	nextSong();
	e.stopPropagation(); // don't let the click event propagate to the mini-bar
});

document.getElementById('queue-mini-bar-play-button').addEventListener('click', function(e) {
	togglePlay();
	e.stopPropagation();
});

var not_run = true;

var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") {
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

document.addEventListener(visibilityChange, handleVisibilityChange, false);

function handleVisibilityChange() {
	var node = document.getElementById(SONGS[NOW_PLAYING_SONG].id);
	if (!document[hidden]) {
		var len = node.seekable.end(0);
		var percent = node.currentTime/len;
		document.getElementById('now-playing-art-bw-container').style.height = Math.floor((1-percent)*375)+'pt';
		document.getElementById('now-playing-progress-control').style.top = Math.floor(((1-percent)*375)+10) + 'pt';
		var thing = (Math.round(node.currentTime - Math.floor(node.currentTime/60)*60) + '');
		thing = Math.floor(node.currentTime/60) + ':' + (thing.length < 2? '0':'') + thing;
		document.getElementById('now-playing-progress-control-l').innerText = thing;
		document.getElementById('now-playing-progress-control-r').innerText = thing;
		not_run = false;
		node.volume = document.getElementById('now-playing-volume-slider').value/100;
	}
}

function frameUpdate() {
	var node = document.getElementById(SONGS[NOW_PLAYING_SONG].id);
	if(!node.paused) {
		var len = node.seekable.end(0);
		var percent = node.currentTime/len;
		document.getElementById('now-playing-art-bw-container').style.height = Math.floor((1-percent)*375)+'pt';
		document.getElementById('now-playing-progress-control').style.top = Math.floor(((1-percent)*375)+10) + 'pt';
		var thing = (Math.round(node.currentTime - Math.floor(node.currentTime/60)*60) + '');
		thing = Math.floor(node.currentTime/60) + ':' + (thing.length < 2? '0':'') + thing;
		document.getElementById('now-playing-progress-control-l').innerText = thing;
		document.getElementById('now-playing-progress-control-r').innerText = thing;
		not_run = false;
		node.volume = document.getElementById('now-playing-volume-slider').value/100;
	}
	window.requestAnimationFrame(frameUpdate);
}

window.requestAnimationFrame(frameUpdate);
