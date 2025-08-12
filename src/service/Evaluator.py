# This service will start a subprocess
# Subprocess will execute
# If subprocess passes:
    # Match output with expected_output ( Interaction w/ repository )
# Else: Return exception to user

from DTO.Submission import Submission
from Executor import runnerMapping


class EvaluationService:

    def __init__(self, code: str, language: str, testcases):
        self.code = code
        self.language = language
        self.testcases = testcases
        self.executor = runnerMapping.get(language)


    # TODO: needs to be async
    # TODO: Graceful error handling
    def run_code(self):
        checklist = [0] * len(self.testcases)
        timer = [0] * len(self.testcases)
        results = self.executor.execute_runner(self.code, self.testcases, checklist, timer)
        # TODO: TLE, MLE cases
