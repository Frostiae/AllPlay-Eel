var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
window.onYouTubeIframeAPIReady = () => {
  console.log("Youtube API ready!");
  createPlayer();
}

var player;
function createPlayer(link) {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: !link ? '' : link,
        playerVars: {
            'playsinline': 1,
            'autoplay': 1
        },
        events: {
            'onReady': onPlayerReady
        }
    });

    console.log("creating");
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function toggleYoutubePlayback() {
    if (player) {
        const state = player.getPlayerState();
        if (state == 1 || state == 3) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
}

function loadVideo(link) {
    player.loadVideoById(link);
}

function PlayVideoYoutube(link) {
    if (!player) {
        createPlayer(link);
    } else {
        loadVideo(link);
    }
}

export { player, loadVideo, createPlayer, PlayVideoYoutube, toggleYoutubePlayback };