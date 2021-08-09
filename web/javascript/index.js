const searchField = document.getElementById("searchField")
searchField.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        eel.search(searchField.value);
    }
})

var playlists;

function authorize_spotify() {
    eel.authorize_spotify();
}

async function create_playlist() {
    eel.create_playlist()(function(res) {
        playlists = res;
    })

    console.log(playlists);
    const playlistlist = document.getElementById("playlistlist");

}