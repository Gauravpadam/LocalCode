import pytest
import json
import sys
from os import path
sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
from src.repository.dataclass import Testcase


class MockTestcaseRepository:

    @staticmethod
    def testcase(testcases) -> Testcase:
        # simulating mayim behavior
        testcase_dicts = list(map(json.loads, testcases))

        # conversion to dataclass
        resolved_testcases = [Testcase(**x) for x in testcase_dicts]

        return resolved_testcases

@pytest.fixture
def example_testcases():
    return list(map(json.dumps, [
        {
            "_id": 1,
            "problem_id": 1,
            "submitted_by": 1,
            "slug": 'two-sum',
            "testcase": { "input": { "params": { "nums": { "type": "list", "value": [2,7,11,15] }, "target": { "type": "integer", "value": 9 } } },"expected_output": { "_output": { "type": "list", "value": [1,0] } } }
        },
    ]))

# TODO: Change this when modelMapper is written
def test_testcase_retrieval(example_testcases):

    assert MockTestcaseRepository.testcase(example_testcases) == [
        Testcase(1, 1, 1, 'two-sum', { "input": { "params": { "nums": { "type": "list", "value": [2,7,11,15] }, "target": { "type": "integer", "value": 9 } } },"expected_output": { "_output": { "type": "list", "value": [1,0] } } })
    ]