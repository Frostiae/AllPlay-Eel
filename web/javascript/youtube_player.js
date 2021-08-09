var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
window.onYouTubeIframeAPIReady = () => {
  console.log("Youtube API ready!");
}

var player;
function createPlayer(link) {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: link,
        playerVars: {
            'playsinline': 1,
            'autoplay': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    console.log("creating");
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log('Current video state: ', event.data);
}

function pausePlay() {
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

export { player, loadVideo, createPlayer };