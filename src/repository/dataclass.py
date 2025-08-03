from dataclasses import dataclass

@dataclass
class Problem:
    id: int
    title: str
    description: str
    submitted_by: int

@dataclass
class Testcase:
    id: int
    problem_id: int
    contributed_by: int
    input_params: str
    expected_output: str

@dataclass
class User:
    id: int
    username: str
    password: str

@dataclass
class Solution:
    id: int
    title: str
    description: str
    code: str
    submitted_by: int

@dataclass
class Submission:
    id: int
    problem_id: int
    submitted_by: int
    code: str
    attempt : str
    passed: bool

    
