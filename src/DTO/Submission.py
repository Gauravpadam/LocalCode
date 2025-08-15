from pydantic import BaseModel

class Submission(BaseModel):
    problem_id: int
    submitted_by: int
    code: str
    language: str
    slug: str
    runtime: float
    space: float
    attempt: int
    is_solution: bool
