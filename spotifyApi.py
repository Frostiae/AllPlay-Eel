import eel
import spotipy
import credentials
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials

spotify = None
sp_oauth = None

scopes = 'user-library-read,streaming,user-read-email,user-read-private,user-read-playback-state,user-modify-playback-state,user-read-currently-playing'


@eel.expose
def authorize_spotify():
    global spotify
    global sp_oauth

    sp_oauth = SpotifyOAuth(client_id=credentials.SPOTIFY_CLIENT_ID,
                            client_secret=credentials.SPOTIFY_CLIENT_SECRET,
                            redirect_uri='http://localhost:8000',
                            scope=scopes)

    spotify = spotipy.Spotify(auth_manager=sp_oauth)
    print(sp_oauth)
    print("Spotify authorization completed.")


@eel.expose
def is_logged_in() -> bool:
    return spotify is not None


@eel.expose
def get_spotify_token() -> str:
    if sp_oauth:
        return sp_oauth.get_access_token()['access_token']

    return "Not signed in."


@eel.expose
def get_tracks(query: str) -> list:
    if spotify:
        results = spotify.search(q=query)['tracks']['items']
        return results
    else:
        return []  # Spotify is probably not authorized
