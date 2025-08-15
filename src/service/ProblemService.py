from typing import Optional
from config import Config
from repository.problems import ProblemRepository
from DTO.Submission import Submission
import traceback

from service.Evaluator import EvaluationService

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

    @classmethod
    def problem(cls, slug:str):

        try:
            problems = cls._repository.problem(slug)

            return problems
        except Exception as e:
            print(traceback.print_exc())
            raise Exception("An error occured in the service layer: {e}".format(e))

    @classmethod
    async def process_submit(cls, submission: Submission):
        # submission_code = cls._repository.write_submission(**submission.model_dump())
        eval_service = EvaluationService(submission.code, submission.language, submission.slug)
        evaluation_results = await eval_service.run_code()
        return evaluation_results
