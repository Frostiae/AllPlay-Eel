class Playlist:
    name = ""
    songs = []

    def __init__(self, name: str) -> None:
        self.name = name

    def __repr__(self) -> str:
        return self.name + ", " + str(len(self.songs)) + " songs"

    def deserialize(self, data) -> None:
        """
        Deserializes a dictionary obtained from the saved JSON file for a Playlist object

        :param data: the JSON dictionary which describes a Playlist object
        """
        self.name = data['name']
        if 'songs' in data:
            self.songs = data['songs']

