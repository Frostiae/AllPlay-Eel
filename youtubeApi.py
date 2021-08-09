import eel
import googleapiclient.discovery
import googleapiclient.errors

youtube = None
API_KEY = 'AIzaSyCxX07j6rjmih5Exm4MFd5qtU4OgL2rIOQ'


def setup():
    api_service_name = "youtube"
    api_version = "v3"

    global youtube
    youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=API_KEY)
    print(youtube)


def get_videos(query):
    request = youtube.search().list(
        part="snippet",
        maxResults=6,
        q=query
    )

    print(request)
    response = request.execute()
    print(response)
