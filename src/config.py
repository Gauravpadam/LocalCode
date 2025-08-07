import os
from enum import Enum
from dotenv import load_dotenv

load_dotenv()


class EnvEnum(Enum):
    PROD = 'PROD'
    DEV = 'DEV'

    @property
    def is_prod(self):
        return self == EnvEnum.PROD
    
    @property
    def is_dev(self):
        return self == EnvEnum.DEV



class Config:

    # Api related
    API_HOST = os.environ['API_HOST']
    API_PORT = os.environ['API_PORT']

    # Env related
    ENV: EnvEnum = os.environ['ENV']

    # Retrieval related
    LIMIT: int = int(os.environ['LIMIT'])

    # DB related
    FLAVOR = os.environ.get('FLAVOR', 'postgres')
    DB_HOST = os.environ['DB_HOST']
    DB_PORT = os.environ['DB_PORT']
    DB_USER = os.environ['DB_USER']
    DB_PASSWORD = os.environ['DB_PASSWORD']
    DB_NAME = os.environ['DB_NAME']

    @classmethod
    def db_url(cls):
        return f"{cls.FLAVOR}://{cls.DB_USER}:{cls.DB_PASSWORD}@{cls.DB_HOST}:{cls.DB_PORT}/{cls.DB_NAME}"



    