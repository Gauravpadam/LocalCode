from repository.dataclass import Problem
from mayim import PostgresExecutor, Mayim, query
from queries import ProblemsQueries
from config import Config
from typing import List, Optional


class ProblemExecutor(PostgresExecutor):

    @query(
            ProblemsQueries.list_all_problems
    )
    async def list_all_problems(self, skip: int, limit: int) -> List[Problem]:
        ...
    
    async def problem(self, problem_id: int) -> Problem:
        ...

    async def write_submission(self, problem_id: int, username: str, code: str, attempt: str, passed: Optional[bool] = False):
        ...


class ProblemRepository:

    _executor = ProblemExecutor()

    async def list_all_problems(self, skip, limit):
        # print(Config.db_url())
        Mayim(dsn=Config.db_url())
        return await self._executor.list_all_problems(skip, limit)

    async def problem(self, skip, limit):
        Mayim(Config.db_url)
        return await self._executor.problem(skip, limit)
    
    async def write_submission(self, problem_id, username, code, attempt, passed = False):
        Mayim(Config.db_url)
        return await self._executor.write_submission(problem_id, username, code, attempt, passed)
    

        



    



        