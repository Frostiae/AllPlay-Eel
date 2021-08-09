const playlist_title = document.getElementById('playlistTitle');
const playlist_info = document.getElementsByClassName('playlistInfo')[0];
const playlist_songs = document.getElementsByClassName('playlistSongs')[0];

var current_playlist;

async function initialize() {
    await eel.get_current_playlist()(function(res) {
        current_playlist = JSON.parse(res);
        console.log(current_playlist);
        update_view();
    })
}

await initialize();


function update_view() {
    playlist_title.insertAdjacentText("afterbegin", current_playlist.name);
    playlist_info.innerText = 'Created on ' + current_playlist.created_on;
    // Add entire duration of playlist here

    // add songs
}
