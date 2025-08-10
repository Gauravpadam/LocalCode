from repository.dataclass import Problem, SuccessfulSubmission
from mayim import PostgresExecutor, Mayim, query
from repository.queries import ProblemsQueries
from config import Config
from typing import List, Optional


class ProblemExecutor(PostgresExecutor):

    @query(
            ProblemsQueries.list_all_problems
    )
    async def list_all_problems(self, skip: int, limit: int) -> List[Problem]:
        ...

    @query(
        ProblemsQueries.fetch_single_problem
    )
    async def problem(self, slug: str) -> Problem:
        ...

    @query(
        ProblemsQueries.insert_submission
    )
    async def write_submission(self, problem_id: int, submitted_by: int, code: str, runtime: float, space:float, attempt:int, is_solution: Optional[bool] = False):
        ...


class ProblemRepository:

    _executor = ProblemExecutor()

    async def list_all_problems(self, skip, limit) -> List[Problem]:
        # print(Config.db_url())
        Mayim(dsn=Config.db_url())
        return await self._executor.list_all_problems(skip, limit)

    async def problem(self, slug: str) -> Problem:
        Mayim(dsn=Config.db_url())
        return await self._executor.problem(slug)

    async def write_submission(self, slug, submitted_by, code, runtime, space, attempt, is_solution = False, problem_id = 1):
        Mayim(dsn=Config.db_url())
        return await self._executor.write_submission(problem_id, submitted_by, code, runtime, space, attempt, is_solution)
