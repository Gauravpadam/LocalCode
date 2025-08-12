from dataclasses import dataclass

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
    contributed_by: int
    input_params: str
    expected_output: str

@dataclass
class User:
    _id: int
    username: str
    password: str

@dataclass
class Submission:
    _id: int
    problem_id: int
    submitted_by: str
    code: str
    language: str
    runtime: float
    space: float
    attempt : int
    is_solution: bool

class SuccessfulSubmission:
    _id: int
