from enum import Enum


class Song:
    title: str
    artist: str
    duration: int
    service_img_url: str
    banner_url: str
    link: str
    type: int

    def __init__(self, title, artist, duration, service_img_url, banner_url, link, type):
        self.title = title
        self.artist = artist
        self.duration = duration
        self.service_img_url = service_img_url        # This is going to be either the youtube logo or the spotify logo
        self.banner_url = banner_url
        self.link = link
        self.type = SongTypes(type)

    def __repr__(self) -> str:
        return self.artist + ' - ' + self.title

    def deserialize(self, data) -> None:
        self.title = data['title']
        self.artist = data['artist']
        self.duration = data['duration']
        self.service_img_url = data['service_img_url']
        self.banner_url = data['banner_url']
        self.link = data['link']
        self.type = data['type']

    def reprJSON(self) -> dict:
        return dict(title=self.title,
                    artist=self.artist,
                    duration=self.duration,
                    service_img_url=self.service_img_url,
                    banner_url=self.banner_url,
                    link=self.link,
                    type=self.type)


class SongTypes(Enum):
    YOUTUBE = 1
    SPOTIFY = 2
