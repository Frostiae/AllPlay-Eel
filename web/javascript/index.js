import { player, loadVideo, createPlayer } from './youtube_player.js';

const searchField = document.getElementById("searchField")
const youtube_results = document.getElementById("youtubeResults");
const spotify_results = document.getElementById("spotifyResults");
const loginBtn = document.getElementById('loginbtn');

loginBtn.addEventListener('click', () => authorize_spotify());

searchField.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        search(searchField.value);
    }
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