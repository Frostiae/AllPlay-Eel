import eel
import spotifyApi
import youtubeApi
from Playlist import Playlist
from Song import Song
import json
import os.path
from Encoder import Encoder

# Set web files folder and optionally specify which file types to check for eel.expose()
#   *Default allowed_extensions are: ['.js', '.html', '.txt', '.htm', '.xhtml']
eel.init('web', allowed_extensions=['.js', '.html'])

playlists = []
current_playlist = None


def initialize():
    # Load existing saved playlists if there are any
    global playlists
    if os.path.exists('playlists.json'):
        settings = open('playlists.json')
        temp = json.load(settings)
        for pl in temp:
            playlist = Playlist('')
            playlist.deserialize(pl)
            playlists.append(playlist)
        settings.close()

    youtubeApi.setup()


@eel.expose
def search(query: str):
    results = {'spotify': spotifyApi.get_tracks(query), 'youtube': youtubeApi.get_videos(query)}
    return json.dumps(results)


@eel.expose
def create_playlist(name: str) -> str:
    """
    Create a new playlist with a default name.

    :return: JSON list of all the current playlists
    """
    playlist = Playlist(name)
    playlists.append(playlist)
    print(playlists)
    with open('playlists.json', 'w+') as f:
        json.dump([pl.reprJSON() for pl in playlists], f, cls=Encoder)

    return json.dumps([pl.reprJSON() for pl in playlists], cls=Encoder)


@eel.expose
def get_playlists() -> str:
    return json.dumps([pl.reprJSON() for pl in playlists], cls=Encoder)


@eel.expose
def set_current_playlist(playlist) -> None:
    global current_playlist
    current_playlist = Playlist('')
    current_playlist.deserialize(playlist)
    print(current_playlist)


@eel.expose
def get_current_playlist() -> str:
    return json.dumps(current_playlist.reprJSON(), cls=Encoder, indent=3)


@eel.expose
def add_song_to_playlist(playlist, song) -> None:
    print(song)
    pl = Playlist('')
    pl.deserialize(playlist)

    sn = Song('', '', 0, '', '', '', 1)
    sn.deserialize(song)
    print(sn)

    playlists[playlists.index(pl)].add_song(sn)
    with open('playlists.json', 'w+') as f:
        json.dump([plist.reprJSON() for plist in playlists], f, cls=Encoder, indent=3)


initialize()
eel.start('templates/index.html', size=(1400, 700), jinja_templates='templates', playlists=playlists)
