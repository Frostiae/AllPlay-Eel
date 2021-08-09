const playlist_title = document.getElementById('playlistTitle');
const playlist_info = document.getElementsByClassName('playlistInfo')[0];
const playlist_songs = document.getElementsByClassName('playlistSongs')[0];

var current_playlist;

// This does not update correctly on the first time... FIGURE OUT WHY!
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
