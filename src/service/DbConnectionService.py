from config import Config
from mayim import Mayim

class DbClient:

    _client = None

    @classmethod
    def get_client(cls):
        if not cls._client:
            cls._client = Mayim(dsn=Config.db_url)
        return cls._client