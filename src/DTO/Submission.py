from pydantic import BaseModel

class Submission(BaseModel):
    slug: str
    problem_id: int
    submitted_by: int
    code: str
    runtime: float
    space: float
    attempt: int
    is_solution: bool
