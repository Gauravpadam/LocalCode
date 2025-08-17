from dataclasses import dataclass, field
from typing import Dict, Any, Union, Optional

@dataclass
class Problem:
    _id: int
    title: str
    description: str
    submitted_by: int
    testcase_id: int
    slug: str

@dataclass
class Testcase:
    _id: int
    problem_id: int
    submitted_by: int
    slug: str
    testcase: Dict[str, Union[str, Dict]]
    __test__ = False # This is for pytest

@dataclass
class User:
    username: str
    email: str
    hashed_password: str
    salt: str
    _id: Optional[int] = field(default=None)

@dataclass
class Submission:
    _id: int
    problem_id: int
    slug: str
    submitted_by: str
    code: str
    language: str
    runtime: float
    space: float
    attempt : int
    is_solution: bool


class SuccessfulSubmission:
    _id: int
