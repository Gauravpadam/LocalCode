from pydantic import BaseModel

class Submission(BaseModel):
    problemId: str
    username: str
    code: str
    attempt: int
