// GLOBAL VARS
var PLAYING_MUSIC = false;
var REPEAT = false;
var SHUFFLE = false;
var LIST_VIEW_MODE = 'song'
var NOW_PLAYING_SONG = 0;
var SONG_QUEUE = [0,1,1,0,1];
var LIBRARY_STATES = [];
var RECENT_SEARCHES = [];

var AUTO_PLAY_NEXT_SONG_IN_QUEUE = false; 

document.getElementById('audioDiv').addEventListener('ended', function() {
	AUTO_PLAY_NEXT_SONG_IN_QUEUE = true;
	console.log('abcd');
	nextSong();
});

// TODO: optional fixed size
function Queue() {
	this._queue = [];
	this._old_queue = []; // for shuffling
	this.first = function() {
		if (this._queue.length > 0) {
			return this._queue.shift();
		}
		return null;
	}
	this.last = function() {
		if (this._queue.length > 0) {
			return this._queue.pop();
		}
		return null;
	}
	this.clear = function(){
		this._queue = [];
	}
	this.append = function(elem) {
		this._queue.push(elem);
	}
	this.prepend = function(elem) {
		this._queue.unshift(elem);
	}
	this.move = function(old, _new) {
		this._queue.splice(_new, 0, this._queue.splice(old, 1)[0]);
	}
	this.remove = function(selectionIndex) {
		this._queue = this._queue.filter(function(element, queueIndex) { return selectionIndex !== queueIndex; });
	}
	this.queue = function() {
		return this._queue;
	}
	this.shuffle = function() {
		this._old_queue = this._queue.slice(0);
		shuffleArray(this._queue);
	}
	this.unshuffle = function() {
		this._queue = this._old_queue.slice(0);
	}
};

function shuffleArray(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function Player() {
	var currentSongDivName = "audioDiv";
	var last_audio = 0;
	this.play = function() {
		document.getElementById(currentSongDivName).play();
	}
	this.pause = function() {
		document.getElementById(currentSongDivName).pause();
	}
	this.currentTime = function() {
		return document.getElementById(currentSongDivName).currentTime;
	}
	this.duration = function() {
		return last_audio;
	}
	this.seek = function(percent) {
		document.getElementById("audioDiv").currentTime = this.duration()*percent;
	}
	this.setSong = function(idx) {
		document.getElementById("audioDiv").src = SONGS[idx].audio;
		document.getElementById("audioDiv").load();
		last_audio = SONGS[idx].duration;
		document.getElementById("audioDiv").currentTime = 0;
	}
	this.paused = function() {
		return document.getElementById(currentSongDivName).paused;
	}
}

var queue = new Queue();

queue.append(0);
queue.append(1);
queue.append(2);
queue.append(1);

var previous_song_queue = new Queue();

var player = new Player();

document.addEventListener("DOMContentLoaded", function(event) {
	filterBy('song'); // initial default state
	player.setSong(2);
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
	setHeader(viewName=='nav-list-view' ? (LIST_VIEW_MODE + 's') : 'Search');
}

function switchTab(tabName) {
	LIBRARY_STATES = [];
	filterBy(tabName);
}

function goToSearchView() {
	document.getElementById('search-input').value = "";
	buildSearchHistory();
	switchSubView('nav-search-view');
	LIBRARY_STATES = [goToSearchView];
	document.getElementById('search-input').focus();
}

function updateNowPlayingSongInformation() {
	document.getElementById('now-playing-song-title').innerText = SONGS[NOW_PLAYING_SONG].name;
	document.getElementById('now-playing-song-details').innerText = SONGS[NOW_PLAYING_SONG].artist + ' - ' + SONGS[NOW_PLAYING_SONG].album;
	document.getElementById('mini-bar-song-title').innerText = SONGS[NOW_PLAYING_SONG].name;
	document.getElementById('mini-bar-song-details').innerText = SONGS[NOW_PLAYING_SONG].artist + ' - ' + SONGS[NOW_PLAYING_SONG].album;
	document.getElementById('queue-mini-bar-song-title').innerText = SONGS[NOW_PLAYING_SONG].name;
	document.getElementById('queue-mini-bar-song-details').innerText = SONGS[NOW_PLAYING_SONG].artist + ' - ' + SONGS[NOW_PLAYING_SONG].album;
	document.getElementById('now-playing-art-color').src =  SONGS[NOW_PLAYING_SONG].albumArt;
	document.getElementById('now-playing-art-bw').src =  SONGS[NOW_PLAYING_SONG].albumArt;
	document.getElementById('mini-bar-album-art-img').src =  SONGS[NOW_PLAYING_SONG].albumArt;
	document.getElementById('queue-mini-bar-album-art-img').src =  SONGS[NOW_PLAYING_SONG].albumArt;
	document.getElementById('now-playing-song-details-container').scrollLeft = 0;
	updateUpNextButton();
}

function updateUpNextButton() {
	var q = queue.queue()
	var button = document.getElementById('now-playing-queue-button');
	var width = button.offsetWidth;
	var height = button.offsetHeight;
	var xinc = width/5;

	var top = button.offsetTop;
	var leftOffset = (width - (xinc * q.length)) / 2
	var left = button.offsetLeft + leftOffset;

	for (var i=0; i<5; i++) {
		var img = document.getElementById('now-playing-queue-img-' + i);
		if (i>=q.length) {
			// hide the img
			img.style.display = 'none';
			continue;
		}
		var songId = q[i];
		// set the album art
		img.src = SONGS[songId]['albumArt'];
		// size and position
		img.style.zIndex = (5-i); // first images higher up
		img.style.opacity = 1.0 - (0.2*i)  // 1.0, 0.8, 0.6, 0.4, 0.2
		img.style.height = (height - (6*i)) + 'px';
		img.style.left = left + (i*xinc) + 'px';
		img.style.top = top + (i*3) + 'px';
		// show the img
		img.style.display = 'inline';
	}
}

function play() {
	// cosmetics
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0005_Pause.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/pause-button.png'
	document.getElementById('queue-mini-bar-play-button').children[0].src = 'images/pause-button.png'
	// functionality
	player.play();
	updateNowPlayingSongInformation();
}

function pause() {
	// cosmetics
	document.getElementById('now-playing-play-button').children[0].src = 'images/icons-png/icon-_0000_Play.png'
	document.getElementById('mini-bar-play-button').children[0].src = 'images/play-button.png'
	document.getElementById('queue-mini-bar-play-button').children[0].src = 'images/play-button.png'
	// functionality
	player.pause();
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
	NOW_PLAYING_SONG = songId;
	// start from beginning
	player.setSong(NOW_PLAYING_SONG);
	play();
}

function nextSong() {
	if (!(player.paused()) && player.currentTime() > 0 || AUTO_PLAY_NEXT_SONG_IN_QUEUE) {
		player.pause();
		var next = queue.first();
		if (REPEAT) {
			queue.append(NOW_PLAYING_SONG);
		}
		if(next == null) {
			pause();
			player.seek(0);
		} else {
			previous_song_queue.append(NOW_PLAYING_SONG);
			NOW_PLAYING_SONG = next;
			player.setSong(NOW_PLAYING_SONG);
		}
		AUTO_PLAY_NEXT_SONG_IN_QUEUE = false;
		if(next != null) {
			last_update = performance.now();
			player.play();
		}
	} else {
		var next = queue.first();
		if(next == null) {
			//
		} else {
			previous_song_queue.append(NOW_PLAYING_SONG);
			NOW_PLAYING_SONG = next;
		}
	}
	buildQueue();
	updateNowPlayingSongInformation();
}

function prevSong() {
	console.log('Back to previous song');

	if (!player.paused() && player.currentTime() > 0) {
		player.pause();
		var last = previous_song_queue.last();
		if(last == null) {
			player.seek(0);
		} else {
			queue.prepend(NOW_PLAYING_SONG);
			NOW_PLAYING_SONG=last;
			player.setSong(NOW_PLAYING_SONG);
		}
		last_update = performance.now();
		player.play();
	} else {
		var last = previous_song_queue.last();
		if(last == null) {
			//
		} else {
			queue.prepend(NOW_PLAYING_SONG);
			NOW_PLAYING_SONG=last;
		}
	}
	buildQueue();
	updateNowPlayingSongInformation();
}

function toggleRepeat() {
	// cosmetics
	if (REPEAT) {
		document.getElementById('now-playing-repeat-button').children[0].src = 'images/icons-png/icon-_0010_RepeatOff.png';
	} else {
		document.getElementById('now-playing-repeat-button').children[0].src = 'images/icons-png/icon-_0011_RepeatOn.png';
	}
	// functionality
	REPEAT = !REPEAT;
}

function toggleShuffle() {
	// cosmetics
	if (SHUFFLE) {
		document.getElementById('now-playing-shuffle-button').children[0].src = 'images/icons-png/icon-_0012_ShuffleOff.png'
	} else {
		document.getElementById('now-playing-shuffle-button').children[0].src = 'images/icons-png/icon-_0013_ShuffleOn.png'
	}
	// functionality
	SHUFFLE = !SHUFFLE;
	if (SHUFFLE) {
		queue.shuffle();
	} else {
		queue.unshuffle();
	}
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
			var song = buildSongListItem(song, 'song', i);
			listView.appendChild(song);
		}
	}
	LIBRARY_STATES.push(function() { searchBy(searchTerm); });
	RECENT_SEARCHES.push(searchTerm);

	switchSubView('nav-list-view'); // go to list view
	setHeader("Search for: " + searchTerm);
}

// filter our songs according to a mode (ie. attribute)
// optionally accept a secondFilter which will further restrict
// our search results
function filterBy(mode, secondFilter, omitFromHistory) {
	// set the global mode (we'll use this for the header)
	LIST_VIEW_MODE = mode;
	var key = (mode=='song'? 'name': mode);

	// populate this listview
	var listView = document.getElementById('nav-list-view');
	listView.innerHTML = ""  // clear the list

	// slice(0) clones the array
	// we need this because sort() sorts IN-PLACE *and* returns the array
	songsToFilter = SONGS.slice(0).sort(function(a, b) {
		var varA = a[key].toLowerCase();
		var varB = b[key].toLowerCase();
		if (varA < varB) { return -1; }
		else if (varA > varB) { return 1; }
		else { return 0; }
	});

	// create the set of items to display (set so we don't display the same album/artist/genre twice)
	var result = new Set();  // EC6 only
	for(var i = 0; i < songsToFilter.length; i++) {
		var song = songsToFilter[i];
		if (result.has(song[key])) {
			continue;
		}
		if (secondFilter && !secondFilter(song)) {
			// if the second filter is defined 
			// and this song doesn't pass that filter
			continue;
		}
		result.add(song[key]);
		var song = buildSongListItem(song, LIST_VIEW_MODE, i);
		listView.appendChild(song);
	}
	switchSubView('nav-list-view'); // go to library
	if (!omitFromHistory) {
		LIBRARY_STATES.push(function() { filterBy(mode, secondFilter, true); }); // for back button
	}

	setHeader(mode + 's');
}

function updateBackButton() {
	if (LIBRARY_STATES.length <= 1) {
		// if we have no where to go back to, don't show the back button
		document.getElementById('nav-header-back-button').style.display = 'none';
	} else {
		document.getElementById('nav-header-back-button').style.display = 'inline';
	}
}

var on_thing = undefined;
var initial_pos = 0;
var thing_open = false;
var nop_mu = false;
var nop_click = false;
var mm = function(ev) {
	if(on_thing !== undefined && !thing_open) {
		var pos = (initial_pos - ev.clientX);
		var sz = parseFloat(getComputedStyle(document.getElementsByClassName('button-thing')[0]).width);
		on_thing.style.right = (pos > sz?sz:(pos < 0?0:pos)) + 'px';
		nop_click = true;
	}
}

var tm = function(ev) {
	if(on_thing !== undefined && !thing_open) {
		var pos = (initial_pos - ev.touches[0].clientX);
		var sz = parseFloat(getComputedStyle(document.getElementsByClassName('button-thing')[0]).width);
		on_thing.style.right = (pos > sz?sz:(pos < 0?0:pos)) + 'px';
		nop_click = true;
	}
}

var mu = function(ev) {
	var pos = (initial_pos - ev.clientX);
	if (on_thing !== undefined && pos >= 0.5*parseFloat(getComputedStyle(document.getElementsByClassName('button-thing')[0]).width) && !nop_mu) {
		console.log('c');
		on_thing.style.right = parseFloat(getComputedStyle(document.getElementsByClassName('button-thing')[0]).width); + 'px'; // TODO: Smooth out
		thing_open = true;
	} else {
		if(on_thing !== undefined) {
			initial_pos = 0;
			on_thing.style.right = '0px'; // TODO: Smooth out
			on_thing = undefined;
		}
	}
	nop_mu = false;
}

var te = function(ev) {
	var pos = (initial_pos - ev.touches[0].clientX);
	if (on_thing!==undefined && pos >= 0.5*parseFloat(getComputedStyle(document.getElementsByClassName('button-thing')[0]).width) && !nop_mu) {
		on_thing.style.right = parseFloat(getComputedStyle(document.getElementsByClassName('button-thing')[0]).width); + 'px'; // TODO: Smooth out
		thing_open = true;
	} else {
		if(on_thing !== undefined) {
			initial_pos = 0;
			on_thing.style.right = '0px'; // TODO: Smooth out
			on_thing = undefined;
		}
	}
	nop_mu = false;
}

function addToQueue(div) {
	queue.append(parseInt(div.dataset.id, 10));
}

function removefromQueue(div) {
	queue.remove(parseInt(div.dataset.counter, 10));
	buildQueue();
}

document.addEventListener('mousemove', mm);
document.addEventListener('touchmove', tm);
document.addEventListener('mouseup', mu);
document.addEventListener('touchend', te);

document.addEventListener('mousedown', function() {
	if(on_thing !== undefined) {
		console.log('a');
		thing_open = false;
		on_thing.style.right = '0px';
		open_thing = undefined;
		nop_mu = true;
		nop_click = true;
	}
});

document.addEventListener('touchstart', function() {
	if(on_thing !== undefined) {
		thing_open = false;
		on_thing.style.right = '0px';
		open_thing = undefined;
		nop_mu = true;
		nop_click = true;
	}
});

function buildSongListItem(songObj, mode, counter, queue_mode = false) {
	var el = document.createElement('li');
	el.id = 'nav-list-view-elements'
	var clickCallback = function() {
		console.log('No callback implemented');
	}
	
	if (mode == 'song') {
		var div = document.createElement('div');
		div.className = 'swiper';
		var title = document.createElement('span');
		title.innerText = songObj['name'];
		title.style.fontSize = '16pt';
		title.style.fontWeight = 'Bold';
		title.style.flexGrow = 2;
		div.appendChild(title);

		var artist = document.createElement('span');
		artist.innerText = songObj['artist'];
		artist.style.fontSize = '12pt';
		div.appendChild(artist);
		if(queue_mode) {
			var handle = document.createElement('img');
			handle.src = "images/unknown.png";
			handle.style.width=20+'pt';
			handle.style.height=20+'pt';
			handle.className = "drag-handle";
			handle.addEventListener('mousedown', function(ev) {ev.stopPropagation();});
			div.appendChild(handle);
		}
		var md = function(ev) {
			if (on_thing !== undefined && thing_open) {
				thing_open = false;
				on_thing.style.right = '0px';
				on_thing = undefined;
			}
			initial_pos = ev.clientX;
			on_thing = div;
			thing_open = false;
			ev.stopPropagation();
		}

		var ts = function(ev) {
			if (on_thing !== undefined && thing_open) {
				thing_open = false;
				on_thing.style.right = '0px';
				on_thing = undefined;
			}
			initial_pos = ev.touches[0].clientX;
			on_thing = div;
			thing_open = false;
			ev.stopPropagation();
		}
		var img = document.createElement('img');
		img.src = songObj['albumArt'];
		img.id = 'nav-list-view-elements-albumArt';
		el.appendChild(img);
		div.addEventListener('mousedown', md);
		div.addEventListener('touchstart', ts);  // TODO: Totally wrong, additional presses will mess stuff up.
		el.appendChild(div);
		var div2 = document.createElement('div');
		div2.className = 'button-thing';
		if (queue_mode) {
			div2.innerText = "Delete";
			div2.style.backgroundColor = "#FF0000";
			div2.addEventListener('mousedown', function() {removefromQueue(div2);}); // It never gets mouseup
			div2.addEventListener('touchstart', function() {removefromQueue(div2);}); // It never gets mouseup
		} else {
			div2.innerText = "Add to Queue";
			div2.style.backgroundColor = "#00FF00";
			div2.addEventListener('mousedown', function() {addToQueue(div2);}); // It never gets mouseup
			div2.addEventListener('touchstart', function() {addToQueue(div2);}); // It never gets mouseup
		}
		var map_thing = {'song-StereoLove': 0, "song-WereInHeaven": 1, "song-Voltaic": 2};
		div2.dataset.id = songObj.index;
		div2.dataset.counter = counter;
		el.appendChild(div2);
		if(queue_mode) {
			clickCallback = function() {
				if (nop_click) {
					nop_click = false;
				} else {
					removefromQueue(div2);
					playSongById(songObj.index);
				}
				//removefromQueue(div2);
				//playSongById(map_thing[songObj['id']]);
			}
		} else {
			clickCallback = function() {
				if (nop_click) {
					nop_click = false;
				} else {
					playSongById(songObj.index);
				}
				//removefromQueue(div2);
				//playSongById(map_thing[songObj['id']]);
			}
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
	document.getElementById('nav-header-text').innerText = newText;
	updateBackButton();
}

function back() {
	if (LIBRARY_STATES.length > 1) {
		LIBRARY_STATES.pop(); // remove last state
		LIBRARY_STATES[LIBRARY_STATES.length - 1]();
	}
}

function buildQueue() {
	var listView = document.getElementById('queue-list-view');
	 $('.sortable').sortable('destroy');
	listView.innerHTML = "";  // clear the list
	for(var i = 0; i < queue.queue().length; i++) {
		var idx = queue.queue()[i];
		var song = buildSongListItem(SONGS[idx], 'song', i, true);
		listView.appendChild(song);
	}
	 $('.sortable').sortable({handle: '.drag-handle'}).bind('sortupdate', function(e,ui) {
	 	if(on_thing !== undefined) {
		 	initial_pos = 0;
			on_thing.style.right = '0px'; // TODO: Smooth out
			on_thing = undefined;
		}
		console.log(ui.item[0].children[2].dataset.counter);
		var a = ui.item[0].children[2].dataset.counter;
		var b = ui.item.index();
		console.log(ui.item.index());
		console.log(ui.item[0]);
		console.log(ui);
		$('.sortable').unbind('sortupdate');  // Destory never unbinds the old sortupdate....
		queue.move(a,b);
		buildQueue();
	});
}

function buildSearchHistory() {
	var list = document.getElementById('search-list');
	list.innerHTML = "";
	for (var i=RECENT_SEARCHES.length-1; i>=0; i--) {
		var searchTerm = RECENT_SEARCHES[i];
		var searchItem = document.createElement('li');
		searchItem.addEventListener('click', function() { searchBy(searchTerm); });
		searchItem.appendChild(document.createTextNode(searchTerm));
		list.appendChild(searchItem);
	}
}

// EVENT LISTENERS
// INITIAL STATE
window.onload = function(event) {
	updateNowPlayingSongInformation();
};

// TRANSITIONS
document.getElementById('now-playing-close-button').addEventListener('click', function() {
	switchView('nav-view');
});

document.getElementById('mini-bar').addEventListener('click', function() {
	switchView('now-playing-view');
});

document.getElementById('now-playing-queue-button').addEventListener('click', function() {
	buildQueue();
	switchView('queue-view');
});

document.getElementById('queue-close-button').addEventListener('click', function() {
	switchView('now-playing-view');
});

document.getElementById('nav-header-back-button').addEventListener('click', back);

document.getElementById('nav-tab-artists').addEventListener('click', function() {
	switchTab('artist');
});

document.getElementById('nav-tab-songs').addEventListener('click', function() {
	switchTab('song');
});

document.getElementById('nav-tab-albums').addEventListener('click', function() {
	switchTab('album');
});

document.getElementById('nav-tab-genre').addEventListener('click', function() {
	switchTab('genre');
});

document.getElementById('nav-tab-search').addEventListener('click', function() {
	goToSearchView();
});

document.getElementById('search-view-lib-button').addEventListener('click', function() {
	switchSubView('nav-list-view'); // go to library
});

// NAV VIEW
document.getElementById('search-input').addEventListener('keypress', function(e) {
	if (e.keyCode === 13) { // enter key
		searchBy(document.getElementById('search-input').value);
	}
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

document.getElementById('now-playing-shuffle-button').addEventListener('click', toggleShuffle);

var abcd = false;
function seekPercent(percent) {
	var clamped = percent< 0?0 :(percent > 1? 1 : percent);
	player.seek(clamped);

}
document.getElementById('now-playing-progress-control-l').addEventListener('mousedown', function() {abcd = true;});
document.getElementById('now-playing-progress-control-l').addEventListener('touchstart', function() {abcd = true;});

document.getElementById('now-playing-progress-control-r').addEventListener('mousedown', function() {abcd = true;});
document.getElementById('now-playing-progress-control-r').addEventListener('touchstart', function() {abcd = true;});
document.addEventListener('mousemove', function(ev) {
	if(abcd) {
		console.log(ev.clientY);
		seekPercent((document.getElementById('now-playing-art-color').offsetHeight-(ev.clientY-document.getElementById('now-playing-art-color').getBoundingClientRect().top))/document.getElementById('now-playing-art-color').offsetHeight);
	}
});

document.addEventListener('touchmove', function(ev) {
	if(abcd) {
		seekPercent((document.getElementById('now-playing-art-color').offsetHeight-(ev.touches[0].clientY-document.getElementById('now-playing-art-color').getBoundingClientRect().top))/document.getElementById('now-playing-art-color').offsetHeight);
	}
});

document.addEventListener('mouseup', function() {abcd = false;});
document.addEventListener('touchend', function() {abcd = false;});


// QUEUE VIEW
document.getElementById('queue-mini-bar-next-button').addEventListener('click', function(e) {
	nextSong();
	e.stopPropagation(); // don't let the click event propagate to the mini-bar
});



document.getElementById('queue-mini-bar-play-button').addEventListener('click', function(e) {
	togglePlay();
	e.stopPropagation();
});

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

//document.addEventListener(visibilityChange, handleVisibilityChange, false);

var last_update = 0;

function redrawStuff(ts) {
	if(!document[hidden]) {
		var len = player.duration();
		len = len == 0?1:len;
		var percent = player.currentTime()/len;
		len = player.duration();
		document.getElementById('now-playing-art-bw-container').style.height = Math.floor((1-percent)*375)+'pt';
		document.getElementById('now-playing-progress-control').style.top = Math.floor(((1-percent)*375)+10) + 'pt';
		var thing = (Math.floor(player.currentTime() - Math.floor(player.currentTime()/60)*60) + '');
		thing = Math.floor(player.currentTime()/60) + ':' + (thing.length < 2? '0':'') + thing;
		document.getElementById('now-playing-progress-control-l').innerText = thing;
		document.getElementById('now-playing-progress-control-r').innerText = thing;
		document.getElementById('audioDiv').volume = document.getElementById('now-playing-volume-slider').value/100;
	}
}

function handleVisibilityChange() {
	redrawStuff(performance.now());
}

function frameUpdate(ts) {
	redrawStuff(ts);
	if(document.getElementById('now-playing-song-details-container').offsetWidth < document.getElementById('now-playing-song-details-container').scrollWidth && (ts-last_update) > 200) {
		if((document.getElementById('now-playing-song-details-container').offsetWidth+document.getElementById('now-playing-song-details-container').scrollLeft) >= document.getElementById('now-playing-song-details-container').scrollWidth && (ts-last_update) > 1000) {
			document.getElementById('now-playing-song-details-container').scrollLeft = 0;
			last_update = ts;
		}
		if((document.getElementById('now-playing-song-details-container').offsetWidth+document.getElementById('now-playing-song-details-container').scrollLeft) < document.getElementById('now-playing-song-details-container').scrollWidth && document.getElementById('now-playing-song-details-container').scrollLeft != 0) {
			last_update = ts;
			document.getElementById('now-playing-song-details-container').scrollLeft += 15;
		} else if (document.getElementById('now-playing-song-details-container').scrollLeft == 0 && (ts-last_update) > 1000) {
			last_update = ts;
			document.getElementById('now-playing-song-details-container').scrollLeft += 15;
		}
	}
	window.requestAnimationFrame(frameUpdate);
}

last_update = performance.now();
window.requestAnimationFrame(frameUpdate);
