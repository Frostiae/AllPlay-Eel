import { player, loadVideo, createPlayer, PlayVideoYoutube } from './youtube_player.js';

const playlist_title = document.getElementById('playlistTitle');
const playlist_info = document.getElementsByClassName('playlistInfo')[0];
const playlist_songs = document.getElementsByClassName('playlistSongs')[0];
const start_button = document.getElementById('startBtn');
const next_button = document.getElementById('nextBtn');
const previous_button = document.getElementById('previousBtn');

start_button.addEventListener('click', () => start_playlist());
next_button.addEventListener('click', () => next_song());
previous_button.addEventListener('click', () => previous_song());

var current_playlist;
var current_song;
var current_song_idx = 0;

// This does not update correctly on the first time... FIGURE OUT WHY!
async function initialize() {
    await eel.get_current_playlist()(function(res) {
        current_playlist = JSON.parse(res);
        console.log(current_playlist);
        update_view();
    })
}

await initialize();

window.onSpotifyWebPlaybackSDKReady = () => initialize_spotify();

async function initialize_spotify() {
    console.log("Ready spotify");
    await eel.get_spotify_token()(function(res) {
        console.log(res);


        const token = res;
        const player = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token); }
        });
      
        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });
      
        // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });
      
        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
        });
      
        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });
      
        // Connect to the player!
        player.connect();
          
    })
}


function play_current_song() {
    if (current_song_idx > current_playlist.songs.length || current_song_idx < 0) {
        current_song_idx = 0;
    }
    current_song = current_playlist.songs[current_song_idx]
    
    // YouTube
    if (current_song.type == 1) {
        PlayVideoYoutube(current_song.link);
    }

    console.log(current_song);
}

function on_youtube_state_change(event) {
    // Song ended
    if (event.data == 0) {
        next_song();
    }
}


function start_playlist() {
    current_song_idx = 0;
    play_current_song();
}

function next_song() {
    current_song_idx += 1;
    play_current_song();
}

function previous_song() {
    current_song_idx -= 1;
    play_current_song();
}


function update_view() {
    playlist_title.insertAdjacentText("afterbegin", current_playlist.name);
    playlist_info.innerText = 'Created on ' + current_playlist.created_on;
    // Todo: Add entire duration of playlist here

    // add songs
    if (current_playlist.songs.length == 0) {
        var hr = document.createElement('hr');
        var figure = document.createElement('figure');
        var name = document.createElement('figcaption');
        name.innerText = 'This playlist contains no songs.';

        playlist_songs.appendChild(hr);
        playlist_songs.appendChild(figure);

        figure.appendChild(name);
    } else {
        current_playlist.songs.forEach(song => {        
            var hr = document.createElement('hr');
            var figure = document.createElement('figure');
            var img = document.createElement('img');
            img.src = song.service_img_url;
            var name = document.createElement('figcaption');
            name.innerText = song.title;
            var artist = document.createElement('figcaption');
            artist.innerText = song.artist;
            var duration = document.createElement('figcaption');
            duration.innerText = song.duration;
    
            playlist_songs.appendChild(hr);
            playlist_songs.appendChild(figure);
    
            figure.appendChild(img);
            figure.appendChild(name);
            figure.appendChild(artist);
            figure.appendChild(duration);
        });
    }
}