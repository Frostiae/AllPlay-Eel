import eel
import spotifyApi
import Playlist
import json

# Set web files folder and optionally specify which file types to check for eel.expose()
#   *Default allowed_extensions are: ['.js', '.html', '.txt', '.htm', '.xhtml']
eel.init('web', allowed_extensions=['.js', '.html'])

playlists = []


@eel.expose                         # Expose this function to Javascript
def say_hello_py(x):
    print('Hello from %s' % x)


@eel.expose
def pycall():
    return 'This is a python call!'


@eel.expose
def search(query: str):
    spotifyApi.get_tracks(query)


@eel.expose
def create_playlist():
    playlist = Playlist.Playlist("New Playlist " + str(len(playlists)))
    playlists.append(playlist)
    print(playlists)
    return json.dumps([pl.__dict__ for pl in playlists])


say_hello_py('Python World!')
eel.say_hello_js('Python World!')   # Call a Javascript function
eel.start('templates/index.html', size=(1400, 700), jinja_templates='templates')
