const searchField = document.getElementById("searchField")
searchField.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        eel.search(searchField.value);
    }
})

var playlists = [];

function authorize_spotify() {
    eel.authorize_spotify();
}

async function create_playlist() {
    eel.create_playlist()(function(res) {
        playlists = JSON.parse(res);
    })

    console.log(playlists);
    update_playlists_view();
}

function update_playlists_view() {
    const playlists_container = document.getElementById("playlistscontainer");
    playlists_container.innerHTML = ''; // Remove all the children that exist already
    playlists.forEach(playlist => {
        var listing = document.createElement('a');
        listing.innerHTML = playlist.name;
        playlists_container.appendChild(listing);
    });
}