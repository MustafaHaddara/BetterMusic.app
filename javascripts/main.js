console.log('This would be the main JS file.');
document.getElementById('now-playing-pause-button').style.display = 'none';

document.getElementById('now-playing-play-button').addEventListener('click', function() {
	document.getElementById('now-playing-play-button').style.display = 'none';
	document.getElementById('now-playing-pause-button').style.display = 'unset';
	document.getElementById('now-playing-repeat-toggle').innerText = 'REPEAT'
}, false);

document.getElementById('now-playing-pause-button').addEventListener('click', function() {
	document.getElementById('now-playing-play-button').style.display = 'unset';
	document.getElementById('now-playing-pause-button').style.display = 'none';
	document.getElementById('now-playing-repeat-toggle').innerText = 'REPEATS'
}, false);