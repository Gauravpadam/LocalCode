from controller.base import BaseController
from config import Config
from DTO.Users import Credentials
from service.UserService import UserService

class UserController(BaseController):

    def __init__(self, prefix = "Users", tags = ["Userapi"]):
        super().__init__(prefix, tags)
        self.UserService = UserService()

    def initialize_and_get_controller(self):
        self.controller.add_api_route(path='/list', endpoint=self.list_users, methods=['get'])
        self.controller.add_api_route(path='/{slug}', endpoint=self.User, methods=['get'])
        self.controller.add_api_route(path='/submit', endpoint=self.submit, methods=['post'])
        return self.controller
    
    async def register_user(self, credentials: Credentials):
        return await self.UserService.register_user(credentials)
    
    async def authenticate_user(self, credentials: Credentials):
        return await self.UserService.authenticate_user(credentials)


    async def list_users(self, skip: int = 0, limit: int = Config.LIMIT):
        return await self.UserService.list_all_Users(skip, limit)

    async def User(self, slug: str):
        return await self.UserService.User(slug)

    async def submit(self, submission: Submission):
        return await self.UserService.process_submit(submission)

    async def list_solutions(self, UserId: str, skip: int = 0, limit: int = Config.LIMIT):
        pass

    async def solution(self, solutionId: str):
        pass
