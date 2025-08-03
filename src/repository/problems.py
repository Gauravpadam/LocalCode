from repository.dataclass import Problem
from mayim import MysqlExecutor, Mayim
from config import Config
from typing import List, Optional


class ProblemRepository(MysqlExecutor):

    async def list_all_problems(self, skip: int, limit: int) -> List[Problem]:
        ...
    
    async def problem(self, problem_id: int) -> Problem:
        ...

    async def write_submission(self, problem_id: int, username: str, code: str, attempt: str, passed: Optional[bool] = False):
        ...


class PRExecutor(ProblemRepository):

    _executor = None

    
    async def list_all_problems(self, skip, limit):
        print(Config.db_url())
        Mayim(dsn=Config.db_url())
        return await super().list_all_problems(skip, limit)

    async def problem(self, skip, limit):
        Mayim(Config.db_url)
        return await super().problem(skip, limit)
    
    async def write_submission(self, problem_id, username, code, attempt, passed = False):
        Mayim(Config.db_url)
        return await super().write_submission(problem_id, username, code, attempt, passed)
    

        



    



        