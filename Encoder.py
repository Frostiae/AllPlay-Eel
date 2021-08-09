from json import JSONEncoder


class Encoder(JSONEncoder):
    def default(self, o):
        if hasattr(o, 'reprJSON'):
            return o.reprJSON()
        else:
            return JSONEncoder.default(self, o)
