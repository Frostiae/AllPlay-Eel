from datetime import date
from Song import Song


class Playlist:
    name: str
    songs: list
    created_on: str

    def __init__(self, name: str) -> None:
        self.name = name
        self.songs = []
        self.created_on = date.today().strftime("%B %d, %Y")

    def __repr__(self) -> str:
        return self.name + ", " + str(len(self.songs)) + " songs"

    def __eq__(self, other):
        return self.name == other.name

    def add_song(self, song: Song) -> None:
        self.songs.append(song)

    def deserialize(self, data) -> None:
        """
        Deserializes a dictionary obtained from the saved JSON file for a Playlist object

        :param data: the JSON dictionary which describes a Playlist object
        """
        self.name = data['name']
        if 'songs' in data:
            self.songs = data['songs']

        self.created_on = data['created_on']

    def reprJSON(self) -> dict:
        return dict(name=self.name,
                    songs=self.songs,
                    created_on=self.created_on)

