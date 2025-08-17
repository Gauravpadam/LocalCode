from src.repository.dataclass import User as UserEntity
from mayim import PostgresExecutor, Mayim, query
from src.repository.queries import UserQueries
from src.config import Config
from typing import List, Optional


class UserExecutor(PostgresExecutor):

    @query(
        UserQueries.does_user_exist
    )
    async def username_fetch(self, username) -> Optional[str]:
        ...
    
    @query(
        UserQueries.register_user
    )
    async def register_user(self, username: str, password: str, salt: str) -> UserEntity:
        ...

    @query(
            UserQueries.fetch_user_details
    )
    async def fetch_user_details(self, username: str) -> UserEntity:
        ...




class UserRepository:

    _executor = UserExecutor()

    async def username_fetch(self, username: str) -> Optional[str]:
        Mayim(dsn=Config.db_url())
        exists = await self._executor.username_fetch(username)
        return exists

    async def register_user(self, user: UserEntity) -> UserEntity:
        Mayim(dsn=Config.db_url())
        creation = await self._executor.register_user(user.username, user.hashed_password, user.salt)
        return creation

    async def fetch_user_details(self, user: UserEntity) -> UserEntity:
        Mayim(dsn=Config.db_url())
        user = await self._executor.fetch_user_details(user.username)
        return user
    