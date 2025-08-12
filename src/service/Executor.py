# Instantiate a runner
# What it needs - code, testcases
import time

from typing import List, Dict

from abc import ABC, abstractmethod
class BaseRunner(ABC):

    @abstractmethod
    @classmethod
    def create_runner(cls) -> "BaseRunner":
        pass

    @abstractmethod
    def execute_runner(self, code: str, testcases: List[Dict]):
        pass

class PythonRunner(BaseRunner):

    _runner = None

    @classmethod
    def create_runner(cls) -> BaseRunner:
        if not cls._runner:
            cls._runner = PythonRunner()
        return cls._runner

    def execute_runner(self, code: str, testcases):
        for i, testcase in enumerate(testcases):
            try:
                tic = time.process_time()
                # runResults = subprocess.run(input)
                toc = time.process_time()
            except Exception as e:
                print(e.with_traceback(None))
                testcases[i]["observed"] = e
                testcases[i]["verdict"] = "Exception" # Enum: Passed failed Exception
                return (testcases, "Exception", i)

            testcases[i]["observed"] = runResults
            testcases[i]["verdict"] = "Passed" if (runResults == testcases[i]["expected_output"]) else "Failed"
            testcases[i]["runtime"] = toc - tic

        return (testcases, "Passed")  # Enum: Passed failed Exception


class JavaRunner(BaseRunner):

    _runner = None

    @classmethod
    def create_runner(cls)  -> BaseRunner:
        if not cls._runner:
            cls._runner = JavaRunner()
        return cls._runner

    def execute_runner(self, code: str, testcases):
        for i, testcase in enumerate(testcases):
            try:
                tic = time.process_time()
                # runResults = subprocess.run(input)
                toc = time.process_time()
            except Exception as e:
                print(e.with_traceback(None))
                testcases[i]["observed"] = e
                testcases[i]["verdict"] = "Exception" # Enum: Passed failed Exception
                return (testcases, "Exception", i)

            testcases[i]["observed"] = runResults
            testcases[i]["verdict"] = "Passed" if (runResults == testcases[i]["expected_output"]) else "Failed"
            testcases[i]["runtime"] = toc - tic

        return (testcases, "Passed")  # Enum: Passed failed Exception

class CRunner(BaseRunner):

    _runner = None

    @classmethod
    def create_runner(cls) -> BaseRunner:
        if not cls._runner:
            cls._runner = CRunner()
        return cls._runner


    def execute_runner(self, code: str, testcases):
        for i, testcase in enumerate(testcases):
            try:
                tic = time.process_time()
                # runResults = subprocess.run(input)
                toc = time.process_time()
            except Exception as e:
                print(e.with_traceback(None))
                testcases[i]["observed"] = e
                testcases[i]["verdict"] = "Exception" # Enum: Passed failed Exception
                return (testcases, "Exception", i)

            testcases[i]["observed"] = runResults
            testcases[i]["verdict"] = "Passed" if (runResults == testcases[i]["expected_output"]) else "Failed"
            testcases[i]["runtime"] = toc - tic

        return (testcases, "Passed")  # Enum: Passed failed Exception

runnerMapping: Dict[str, BaseRunner] = {
    "python": PythonRunner.create_runner(),
    "java": JavaRunner.create_runner(),
    "c": CRunner.create_runner()
}
