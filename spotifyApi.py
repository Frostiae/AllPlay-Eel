import eel
import spotipy
import credentials
from spotipy.oauth2 import SpotifyOAuth

spotify = None


@eel.expose
def authorize_spotify():
    global spotify
    spotify = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=credentials.SPOTIFY_CLIENT_ID,
                                                        client_secret=credentials.SPOTIFY_CLIENT_SECRET,
                                                        redirect_uri="http://localhost:8000",
                                                        scope="user-library-read"))
    print("Spotify authorization completed.")


@eel.expose
def get_tracks(query: str) -> list:
    if spotify:
        results = spotify.search(q=query)['tracks']['items']
        return results
    else:
        return []  # Spotify is probably not authorized
