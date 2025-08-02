import os
from enum import Enum

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

    API_HOST = os.environ['API_HOST']
    API_PORT = os.environ['API_PORT']

    ENV: EnvEnum = os.environ['ENV']

    LIMIT: int = int(os.environ['LIMIT'])



    