console.log('This would be the main JS file.');
document.getElementById('now-playing-pause-button').style.display = 'none';
document.getElementById('now-playing-repeat-on-button').style.display = 'none';
document.getElementById('now-playing-shuffle-on-button').style.display = 'none';

document.getElementById('now-playing-play-button').addEventListener('click', function() {
	document.getElementById('now-playing-play-button').style.display = 'none';
	document.getElementById('now-playing-pause-button').style.display = 'unset';
}, false);

document.getElementById('now-playing-pause-button').addEventListener('click', function() {
	document.getElementById('now-playing-play-button').style.display = 'unset';
	document.getElementById('now-playing-pause-button').style.display = 'none';
}, false);

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