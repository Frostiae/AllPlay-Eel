import { player, loadVideo, createPlayer } from './youtube_player.js';
import { playlists } from './sidebar.js';

const searchField = document.getElementById("searchField")
const youtube_results = document.getElementById("youtubeResults");
const spotify_results = document.getElementById("spotifyResults");
const loginBtn = document.getElementById('loginbtn');
const ctxMenu = document.getElementById('ctxMenu');
const addMenu = document.getElementById('addMenu');

loginBtn.addEventListener('click', () => authorize_spotify());

searchField.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        search(searchField.value);
    }
})

document.addEventListener('click', () => {
    addMenu.style.display = '';
    addMenu.style.left = '';
    addMenu.style.top = '';
})

function authorize_spotify() {
    eel.authorize_spotify();
}

function search(query) {
    var results;
    eel.search(searchField.value)(function(res) {
        results = JSON.parse(res);
        console.log(results);
        create_youtube_list(results['youtube']);
        create_spotify_list(results['spotify']);
    });
}

function create_spotify_list(results) {
    spotify_results.innerHTML = '';
    console.log(results);

    if (results.length == 0) {
        var figure = document.createElement('figure');
        var figcaption = document.createElement('figcaption');
        var span = document.createElement('span');
        span.innerText = 'No results found.';

        figcaption.appendChild(span);
        figure.appendChild(figcaption);
        spotify_results.appendChild(figure);
        return;
    }

    results.forEach(track => {
        var figure = document.createElement('figure');

        figure.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            addMenu.innerHTML = '';

            playlists.forEach(pl => {
                var menuItem = document.createElement('menu');
                menuItem.title = pl.name;
                menuItem.addEventListener('click', () => {
                    var song = {
                        'title': track.name,
                        'artist': track.artists[0].name,
                        'duration': 0,
                        'service_img_url': '../images/spotify.png',
                        'banner_url': '', // todo
                        'link': '', // todo
                        'type': 2 // 2 = Spotify
                    };

                    eel.add_song_to_playlist(pl, song);
                })
                addMenu.appendChild(menuItem);
            });

            addMenu.style.display = 'block';
            addMenu.style.left = (event.pageX - 10) + 'px';
            addMenu.style.top = (event.pageY - 10) + 'px';
        }, false)

        var img = document.createElement('img');
        img.src = track.album.images[0].url;
        var figcaption = document.createElement('figcaption');
        var span = document.createElement('span');
        span.innerText = track.name;
        var description = document.createElement('div')
        description.className = 'figdescription';
        description.innerText = track.artists[0].name;
        var add_btn = document.createElement('button');
        add_btn.innerText = 'Add';

        figure.appendChild(img);
        figure.appendChild(figcaption);
        figcaption.appendChild(span);
        figcaption.appendChild(description);
        figcaption.appendChild(add_btn);

        spotify_results.appendChild(figure);
    });
}

function create_youtube_list(results) {
    youtube_results.innerHTML = ''; // Remove all the children that exist already

    if (!results.items) {
        var figure = document.createElement('figure');
        var figcaption = document.createElement('figcaption');
        var span = document.createElement('span');
        span.innerText = 'No results found.';

        figcaption.appendChild(span);
        figure.appendChild(figcaption);
        youtube_results.appendChild(figure);
        return;
    }

    results.items.forEach(video => {
        var figure = document.createElement('figure');

        // Context menu stuff for adding songs
        figure.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            addMenu.innerHTML = '';

            playlists.forEach(pl => {
                var menuItem = document.createElement('menu');
                menuItem.title = pl.name;
                menuItem.addEventListener('click', () => {
                    var song = {
                        'title': video.snippet.title,
                        'artist': video.snippet.channelTitle,
                        'duration': 0,
                        'service_img_url': '../images/youtube.png',
                        'banner_url': '', // todo
                        'link': video.id.videoId,
                        'type': 1 // 1 = Youtube
                    };

                    eel.add_song_to_playlist(pl, song);
                })
                addMenu.appendChild(menuItem);
            });

            addMenu.style.display = 'block';
            addMenu.style.left = (event.pageX - 10) + 'px';
            addMenu.style.top = (event.pageY - 10) + 'px';
        }, false)

        var img = document.createElement('img');
        img.src = video.snippet.thumbnails.default.url;

        var figcaption = document.createElement('figcaption');
        figcaption.addEventListener('click', () => {
            play_youtube(video.id.videoId);
        })

        var span = document.createElement('span');
        span.innerText = video.snippet.title;
        var description = document.createElement('div')
        description.className = 'figdescription';
        description.innerText = video.snippet.channelTitle;

        var add_btn = document.createElement('button');

        add_btn.innerText = 'Add';

        figure.appendChild(img);
        figure.appendChild(figcaption);
        figcaption.appendChild(span);
        figcaption.appendChild(description);
        figcaption.appendChild(add_btn);

        youtube_results.appendChild(figure);
    });
}

function play_youtube(link) {
    if (!player) {
        createPlayer(link);
    } else {
        loadVideo(link);
    }
}