from repository.dataclass import Testcase
from mayim import PostgresExecutor, Mayim, query
from repository.queries import TestcaseQueries
from config import Config
from typing import List, Optional


class TestcaseExecutor(PostgresExecutor):

    @query(
        TestcaseQueries.fetch_testcase
    )
    async def testcase(self, slug: str, fields: Optional[str]) -> Testcase:
        ...



class TestcaseRepository:

    _executor = TestcaseExecutor()

    async def testcase(self, slug: str) -> Testcase:
        Mayim(dsn=Config.db_url())
        testcase = await self._executor.testcase(slug, fields = "*")
        return testcase