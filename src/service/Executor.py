# Instantiate a runner
# What it needs - code, testcases
import time
import os
import subprocess

from typing import List, Dict

from abc import ABC, abstractmethod

async def save_file(code, language, dir = "./tmp"):

    if not os.path.exists(dir):
        os.mkdir(dir)

    filepath = os.path.join(dir, f"Solution{languageExtensionMapping[language]}")

    with open (filepath, 'w') as file:
        file.write(code)

    return filepath

async def subprocess_exec(code, language, testcases):

    filepath = await save_file(code, language)

    if language in languageExecMapping:
        for i, testcase in enumerate(testcases):
            # params = testcase["input"]["params"]
            # nums = params["nums"]
            # target = params["target"]
            # extensions = [filepath]

            arraybuilder = languageExecMapping[language]
            arraybuilder.append(filepath)
            try:
                tic = time.process_time()
                complete_process = subprocess.run(arraybuilder, check = True, capture_output=True)
                toc = time.process_time()
            except Exception as e:
                print(e.with_traceback(None))
                testcases[i]["observed"] = e
                testcases[i]["verdict"] = "Exception" # Enum: Passed failed Exception
                return (testcases, "Exception", i)

            testcases[i]["observed"] = complete_process.stdout[-1] # TODO: This needs parsing
            testcases[i]["verdict"] = "Passed" if (complete_process.stdout[-1] == testcases[i]["expected_output"]) else "Failed"
            testcases[i]["runtime"] = toc - tic

        return (testcases, "Passed")  # Enum: Passed failed Exception

class BaseRunner(ABC):

    @classmethod
    @abstractmethod
    def create_runner(cls) -> "BaseRunner":
        pass

    @abstractmethod
    async def execute_runner(self, code: str, language, testcases: List[Dict]):
        pass

class PythonRunner(BaseRunner):

    _runner = None

    @classmethod
    def create_runner(cls) -> BaseRunner:
        if not cls._runner:
            cls._runner = PythonRunner()
        return cls._runner

    async def execute_runner(self, code: str, language, testcases):
        # testcases = [
        #     {
        #         "input": {
        #             "params": {
        #                 "nums": [2, 7, 11, 15],
        #                 "target": 9
        #             }
        #         },
        #         "expected_output": [0, 1]
        #     }
        # ]
        return await subprocess_exec(code, language, testcases)


class JavaRunner(BaseRunner):

    _runner = None

    @classmethod
    def create_runner(cls)  -> BaseRunner:
        if not cls._runner:
            cls._runner = JavaRunner()
        return cls._runner

    async def execute_runner(self, code: str, language, testcases):
        return await subprocess_exec(code, language, testcases)

class CRunner(BaseRunner):

    _runner = None

    @classmethod
    def create_runner(cls) -> BaseRunner:
        if not cls._runner:
            cls._runner = CRunner()
        return cls._runner


    async def execute_runner(self, code: str, language, testcases):
        return await subprocess_exec(code, language, testcases)



runnerMapping: Dict[str, BaseRunner] = {
    "python": PythonRunner.create_runner(),
    "java": JavaRunner.create_runner(),
    "c": CRunner.create_runner()
}

languageExecMapping: Dict[str, List[str]] = {
    "python": ["python"],
    "java": ["java", "Solution.java"],
    "c": ["gcc", "Solution.c", "-o", "Solution", "&&", "./Solution"]
}

languageExtensionMapping: Dict[str, str] = {
    "python": ".py",
    "java": ".java",
    "c": ".c"
}
