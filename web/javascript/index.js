import { player, loadVideo, createPlayer, PlayVideoYoutube } from './youtube_player.js';
import { playlists } from './sidebar.js';

const searchField = document.getElementById("searchField")
const youtube_results = document.getElementById("youtubeResults");
const spotify_results = document.getElementById("spotifyResults");
const youtube_tab = document.getElementsByClassName('tablinks')[0];
const spotify_tab = document.getElementsByClassName('tablinks')[1];
const loginBtn = document.getElementById('loginbtn');
const addMenu = document.getElementById('addMenu');

loginBtn.addEventListener('click', () => authorize_spotify());
// passing in the tab itself here because I need to also call open_tab from searching.
youtube_tab.addEventListener('click', () => open_tab(youtube_tab, 'youtubeResults'));
spotify_tab.addEventListener('click', () => open_tab(spotify_tab, 'spotifyResults'));

var logged_in_spotify = false;

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

function open_tab(e, tab) {
    var i;
    var tabcontents = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = 'none';
    }

    var tabs = document.getElementsByClassName('tablinks');
    for (i = 0; i < tabs.length; i++) {
        tabs[i].id = tabs[i].id.replace("active", "");
    }

    document.getElementById(tab).style.display = "block";
    e.id = "active";
}

function authorize_spotify() {
    eel.authorize_spotify();
    eel.is_logged_in()(function(res) {
        logged_in_spotify = JSON.parse(res);
        loginBtn.innerText = 'Logged in'
    })
}

function search(query) {
    var results;
    eel.search(searchField.value)(function(res) {
        results = JSON.parse(res);
        console.log(results);
        create_youtube_list(results['youtube']);
        create_spotify_list(results['spotify']);
    });

    open_tab(youtube_tab, 'youtubeResults');
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
                        'link': track.uri, // todo
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
        var name = document.createElement('figcaption');
        name.innerText = track.name;
        var description = document.createElement('figcaption')
        description.innerText = track.artists[0].name;
        var duration = document.createElement('figcaption');
        duration.innerText = '0:00';

        figure.appendChild(img);
        figure.appendChild(name);
        figure.appendChild(description);
        figure.appendChild(duration)

        spotify_results.appendChild(figure);
        spotify_results.appendChild(document.createElement('hr'));
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

        var name = document.createElement('figcaption');
        name.addEventListener('click', () => {
            PlayVideoYoutube(video.id.videoId);
        })
        name.innerText = video.snippet.title;

        var description = document.createElement('figcaption')
        description.innerText = video.snippet.channelTitle;
        var duration = document.createElement('figcaption');
        duration.innerText = '0:00';

        figure.appendChild(img);
        figure.appendChild(name);
        figure.appendChild(description);
        figure.appendChild(duration)

        youtube_results.appendChild(figure);
        youtube_results.appendChild(document.createElement('hr'));
    });
}