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

    if (player) {
        player.addEventListener('onStateChange', (event) => on_youtube_state_change(event))
    }
}

await initialize();

window.onSpotifyWebPlaybackSDKReady = () => initialize_spotify();

var spotify_player;
var spotify_token;
var spotify_player_device_id;
// For some reason the spotify web player API does not have an event for song ended, so we need this bool set on a
// little timer to go to the next song when state.paused == true and state.position == 0 (position is 0 at the end of the song... why spotify?)
var can_move_spotify = true;


async function initialize_spotify() {
    console.log("Ready spotify");
    await eel.get_spotify_token()(function(res) {
        console.log(res);
        spotify_token = res;

        //const token = res;
        spotify_player = new Spotify.Player({
          name: 'AllPlay',
          getOAuthToken: cb => { cb(spotify_token); },
          volume: 0.5
        });
      
        // Error handling
        spotify_player.addListener('initialization_error', ({ message }) => { console.error(message); });
        spotify_player.addListener('authentication_error', ({ message }) => { console.error(message); });
        spotify_player.addListener('account_error', ({ message }) => { console.error(message); });
        spotify_player.addListener('playback_error', ({ message }) => { console.error(message); });
      
        // Playback status updates
        spotify_player.addListener('player_state_changed', state => { 
            console.log(state); 
            if (state.position == 0 && state.paused) {
                console.log("track ended.");

                if (can_move_spotify) {
                    can_move_spotify = false;
                    next_song();
                }
            }
        });
      
        // Ready
        spotify_player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          spotify_player_device_id = device_id
        });
      
        // Not Ready
        spotify_player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });
      
        // Connect to the player!
        spotify_player.connect();
        console.log(spotify_player);
    })
}

function PlaySongSpotify(link) {
    console.log("Attempting to play song...");
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotify_player_device_id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [link] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotify_token}`
      },
    });
}

function seek_spotify() {
    //spotify_player.seek(215 * 1000);
}

function play_current_song() {
    if (current_song_idx >= current_playlist.songs.length || current_song_idx < 0) {
        current_song_idx = 0;
    }

    var previous_type;
    if (current_song) {
        previous_type = current_song.type;
    }
    current_song = current_playlist.songs[current_song_idx]

    if (current_song.type != previous_type) {
        if (previous_type == 2) {
            spotify_player.pause();
        }
        else if (previous_type == 1) {
            player.pauseVideo();
        }
    }

    console.log(current_song_idx)
    // YouTube
    if (current_song.type == 1) {
        PlayVideoYoutube(current_song.link);
    }

    // Spotify
    else if (current_song.type == 2) {
        PlaySongSpotify(current_song.link);
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
    setTimeout(() => { can_move_spotify = true; }, 2000);
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