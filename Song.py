class Song:
    title: str
    artist: str
    duration: int
    imageUrl: str
    link: str

    def __init__(self, title, artist, duration, image_url, link):
        self.title = title
        self.artist = artist
        self.duration = duration
        self.imageUrl = image_url        # This is going to be either the youtube logo or the spotify logo
        self.link = link

    def __repr__(self) -> str:
        return self.artist + ' - ' + self.title

    def deserialize(self, data) -> None:
        self.title = data['title']
        self.artist = data['artist']
        self.duration = data['duration']
        self.imageUrl = data['imageUrl']
        self.link = data['link']
