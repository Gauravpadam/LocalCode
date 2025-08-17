from pydantic import BaseModel
from typing import Optional

class Credentials(BaseModel):
    username: str 
    email: Optional[str]
    password: str

