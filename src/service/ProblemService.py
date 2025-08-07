from config import Config
from repository.problems import ProblemRepository
import traceback

class ProblemService:

    _repository = ProblemRepository()

    @classmethod
    def list_all_problems(cls, skip: int, limit: int):

        try:
            problems = cls._repository.list_all_problems(skip, limit)

            return problems
        except Exception as e:
            print(traceback.print_exc())
            raise Exception("An error occured in the service layer: {e}".format(e))