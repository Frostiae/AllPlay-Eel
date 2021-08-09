const searchField = document.getElementById("searchField")
searchField.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        eel.search(searchField.value);
    }
})

console.log(searchField);

function authorize_spotify() {
    eel.authorize_spotify();
}

async function create_playlist() {
    eel.create_playlist()(function(playlists) {
        console.log(playlists);
    })
}