import googleapiclient.discovery
import googleapiclient.errors
import credentials

youtube = None


def setup():
    api_service_name = "youtube"
    api_version = "v3"

    global youtube
    youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=credentials.YOUTUBE_API_KEY)
    print(youtube)


def get_videos(query) -> str:
    """
    Returns a list of videos from YouTube based on the given query.

    :param query: Phrase to search YouTube by
    :return: JSON list of search YouTube search results
    """
    request = youtube.search().list(
        part="snippet",
        maxResults=6,
        q=query
    )
    response = request.execute()
    return response
