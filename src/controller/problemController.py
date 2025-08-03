from controller.base import BaseController
from config import Config
from schema.problems import *
from service.ProblemService import ProblemService

class ProblemController(BaseController):

    def __init__(self, prefix = "problems", tags = ["problemapi"]):
        super().__init__(prefix, tags)
        self.problemService = ProblemService()
    
    def initialize_and_get_controller(self):
        self.controller.add_api_route(path='/list', endpoint=self.list_problems, methods=['get'])
        self.controller.add_api_route(path='/{problemId}', endpoint=self.problem, methods=['get'])
        self.controller.add_api_route(path='/submit', endpoint=self.submit, methods=['post'])
        self.controller.add_api_route(path='/{problemId}/solutions', endpoint=self.list_solutions, methods=['get'])
        self.controller.add_api_route(path='/solution/{solutionId}', endpoint=self.solution, methods=['get'])
        return self.controller
    
    
    async def list_problems(self, skip: int = 0, limit: int = Config.LIMIT):
        return await self.problemService.list_all_problems(skip, limit)
        

    def problem(self, problemId: str):
        pass

    def submit(self, submission: Submission):
        pass

    def list_solutions(self, problemId: str, skip: int = 0, limit: int = Config.LIMIT):
        pass

    def solution(self, solutionId: str):
        pass



    
