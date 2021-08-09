const playlists_container = document.getElementById("playlistscontainer");
const newPlaylistBtn = document.getElementById('newPlaylistBtn');

newPlaylistBtn.addEventListener('click', () => create_playlist());

var playlists = [];

async function initialize() {
    await eel.get_playlists()(function(res) {
        playlists = JSON.parse(res);
        update_playlists_view();
    })
}

await initialize();

async function create_playlist() {
    var name = prompt('Enter a title for the playlist', 'New playlist');
    eel.create_playlist(name)(function(res) {
        playlists = JSON.parse(res);
        update_playlists_view();
    })
}

function update_playlists_view() {
    playlists_container.innerHTML = ''; // Remove all the children that exist already
    playlists.forEach(playlist => {
        var listing = document.createElement('a');
        listing.innerHTML = playlist.name;
        listing.addEventListener('click', () => {
            window.location.href = 'playlist.html';
            eel.set_current_playlist(playlist);
        })
        playlists_container.appendChild(listing);
    });
}

export { playlists }