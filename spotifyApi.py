import eel
import spotipy
from spotipy.oauth2 import SpotifyOAuth

spotify = spotipy.Spotify


@eel.expose
def authorize_spotify():
    global spotify
    spotify = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="491a1858834941e0a187c5ac7aa8f3d3",
                                                        client_secret="b6d3226429c6475ebb31370c98589391",
                                                        redirect_uri="http://localhost:8000",
                                                        scope="user-library-read"))
    print("Spotify authorization completed.")


@eel.expose
def get_tracks(query: str):
    results = spotify.search(q=query)['tracks']['items']
    for song in results:
        print(song['name'])