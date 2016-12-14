# INSTRUCTIONS TO RUN# Run Instructions

## Recommended device
A computer with a recent version of Google Chrome and a screen resolution height of >900 px

## To Run
Navigate to: https://mustafahaddara.github.io/BetterMusicApp/
(note: due to details in github’s hosting structure, this URL is case-sensitive)
If part of the screen is cut off, on Windows you may enter fullscreen in the browser by pressing the F11 key.

## Operation
### Now Playing
The Now Playing view displays information about the currently playing song.

The three buttons in the center, above the album art, are playback controls. In order from left to right, the buttons correspond to the actions: "Go to Previous Song", "Play/Pause Current Song", "Go to Next Song".

Below the album art, the song title, artist, and album are displayed. Below that information, there is a slider to control the output volume, where dragging the slider to the left will decrease the volume, and dragging the slider to the right will increase the volume.

Below the volume slider are the queue modification controls. The left-most button toggles "Repeat" on and off, and the right-most button toggles "Shuffle" on and off. The center button will take the user to the Queue view (when there are songs queued to be played next) and will display the phrase "No songs in Queue" when the queue is empty.

The downwards-pointing arrow at the very top of the Now Playing screen is a close button. This minimizes the Now Playing screen and takes the user to the Library view.

On either side of the album art art progress indicators. These display the current position (in time) within the currently playing song. They can be dragged up or down to fast-forward or rewind, respectively, through the song.

Additionally, the album art starts off in a black and white state, but as the song plays and the progress indicators travel up, the portion of the album art below the progress indicators will be coloured in. This provides a quick visual display of how much progress has been made through the song.

### Library
The Library view is sorted into 5 tabs: Artist, Songs, Albums, Genre, Search. When you first go to the Library view, you are taken to the Songs tab. 

At the top of the view is a header displaying the name of the current view.

Switching to the Genres tab will display a list of genres of all songs in the library. Selecting one will display a list of artists that have written songs in that genre.

From a list of artists (either from the Artists tab or by selecting a genre in the Genres tab), you can tap an artist to view a list of all albums by that artist.

From a list of albums, you can tap an album to view all songs in that album.

From a list of songs, you can tap on a song to immediately play it, or you can swipe the song to the left in order to reveal the "Add to Queue" button, which, when tapped, will add the song to the end of the queue of upcoming songs.

In the Search view, there is a text input field where you can enter their search term. Pressing enter will search for songs matching that criteria and display a list of the results (currently only searches for songs which _begin with_ the search term; full text search is not yet implemented). There is also a list of recent searches; tapping on an item will re-conduct that search.

There is also a back button along the header of any library screen which was NOT accessed by directly pressing a tab from the tab bar in the bottom (ie. by selecting an artist from the list of artists). This button takes you back to the previous screen.

Above the tab bar is a mini-player which displays information about the currently playing and provides buttons to pause/play the current song or skip to the next song.

### Queue
The queue of upcoming songs displays a close button at the top, which takes you back to the Now Playing view.

Below the close button is a pinned mini-player, exactly like the one in the Library view. 

Below the mini-player, there is a list of songs queued to be played next. Tapping one of these songs will immediately play it (and clear the queue). Swiping this song to the left will reveal a button to delete that song from the Queue. 

## Source Code
Source code available at: https://github.com/MustafaHaddara/BetterMusicApp/archive/master.zip
To run from source, download and extract the zip file and then open the file "index.html" in a web browser (ie. Google Chrome).

Typically this can be done by double-clicking on the file. However, if you have configured a different kind of application to open html files (such as a text editor, for example) then you may drag and drop the "index.html" file into an open web browser window.
