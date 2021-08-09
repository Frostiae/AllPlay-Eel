import eel
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Set web files folder and optionally specify which file types to check for eel.expose()
#   *Default allowed_extensions are: ['.js', '.html', '.txt', '.htm', '.xhtml']
eel.init('web', allowed_extensions=['.js', '.html'])


spotify = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="491a1858834941e0a187c5ac7aa8f3d3",
                                                    client_secret="b6d3226429c6475ebb31370c98589391",
                                                    redirect_uri="http://localhost:4200",
                                                    scope="user-library-read"))


@eel.expose                         # Expose this function to Javascript
def say_hello_py(x):
    print('Hello from %s' % x)


@eel.expose
def pycall():
    return 'This is a python call!'


def get_tracks():
    results = spotify.current_user_saved_tracks()
    for idx, item in enumerate(results['items']):
        track = item['track']
        print(idx, track['artists'][0]['name'], " - ", track['name'])


say_hello_py('Python World!')
eel.say_hello_js('Python World!')   # Call a Javascript function

get_tracks()



eel.start('hello.html', size=(1400, 700))
