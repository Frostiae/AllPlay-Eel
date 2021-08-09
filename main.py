import eel
import spotifyApi
import youtubeApi
import Playlist
import json

# Set web files folder and optionally specify which file types to check for eel.expose()
#   *Default allowed_extensions are: ['.js', '.html', '.txt', '.htm', '.xhtml']
eel.init('web', allowed_extensions=['.js', '.html'])

playlists = []


def initialize():
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
    playlist = Playlist.Playlist("New Playlist " + str(len(playlists) + 1))
    playlists.append(playlist)
    print(playlists)
    return json.dumps([pl.__dict__ for pl in playlists])


initialize()
eel.start('templates/index.html', size=(1400, 700), jinja_templates='templates', playlists=playlists)
