import eel
import spotifyApi
import youtubeApi
from Playlist import Playlist
import json
import os.path

# Set web files folder and optionally specify which file types to check for eel.expose()
#   *Default allowed_extensions are: ['.js', '.html', '.txt', '.htm', '.xhtml']
eel.init('web', allowed_extensions=['.js', '.html'])

playlists = []


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

    print(playlists)
    youtubeApi.setup()


@eel.expose
def search(query: str):
    results = {'spotify': spotifyApi.get_tracks(query), 'youtube': youtubeApi.get_videos(query)}
    return json.dumps(results)


@eel.expose
def create_playlist() -> str:
    """
    Create a new playlist with a default name.

    :return: JSON list of all the current playlists
    """
    playlist = Playlist("New Playlist " + str(len(playlists) + 1))
    playlists.append(playlist)
    print(playlists)
    with open('playlists.json', 'w+') as f:
        json.dump([pl.__dict__ for pl in playlists], f)

    return json.dumps([pl.__dict__ for pl in playlists])


@eel.expose
def get_playlists() -> str:
    return json.dumps([pl.__dict__ for pl in playlists])


initialize()
eel.start('templates/index.html', size=(1400, 700), jinja_templates='templates', playlists=playlists)
