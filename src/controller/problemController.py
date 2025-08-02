from controller.base import BaseController
from config import Config
from schema.problems import *

class ProblemController(BaseController):

    def __init__(self, prefix):
        super().__init__(prefix)
    
    def initialize_and_get_controller(self):
        self.controller.add_api_route(path='/list', endpoint=self.list_problems, methods=['get'])
        self.controller.add_api_route(path='/{problemId}', endpoint=self.problem, methods=['get'])
        self.controller.add_api_route(path='/submit', endpoint=self.submit, methods=['post'])
        self.controller.add_api_route(path='/{problemId}/solutions', endpoint=self.list_solutions, methods=['get'])
        self.controller.add_api_route(path='/solution/{solutionId}', endpoint=self.solution, methods=['get'])
        return self.controller
    
    
    def list_problems(self, skip: int = 0, limit: int = Config.LIMIT):
        pass

    def problem(self, problemId: str):
        pass

    def submit(self, submission: Submission):
        pass

    def list_solutions(self, problemId: str, skip: int = 0, limit: int = Config.LIMIT):
        pass

    def solution(self, solutionId: str):
        pass



    
