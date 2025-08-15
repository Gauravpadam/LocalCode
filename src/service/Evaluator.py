# This service will start a subprocess
# Subprocess will execute
# If subprocess passes:
    # Match output with expected_output ( Interaction w/ repository )
# Else: Return exception to user

from DTO.Submission import Submission
from service.Executor import runnerMapping


class EvaluationService:

    def __init__(self, code: str, language: str, testcases):
        self.code = code
        self.language = language
        self.testcases = testcases
        self.executor = runnerMapping.get(language)


    # TODO: Why is this service running the code! xD
    # TODO: Graceful error handling
    async def run_code(self):
        # checklist = [0] * len(self.testcases)
        # timer = [0] * len(self.testcases)
        
        results = await self.executor.execute_runner(self.code, self.language, self.testcases)
        return results
        # TODO: TLE, MLE cases
