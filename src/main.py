from fastapi import FastAPI
from controller.problemController import ProblemController
from controller.TestcaseController import TestcaseController
from controller.UserController import UserController
from config import Config

import uvicorn

app = FastAPI()
app.include_router(ProblemController().initialize_and_get_controller())
app.include_router(TestcaseController().initialize_and_get_controller())
app.include_router(UserController().initialize_and_get_controller())

# TODO: (One common for all repos and applicable services) Make repos and services singleton
if __name__ == '__main__':
    uvicorn.run(app=app, host=Config.API_HOST, port=int(Config.API_PORT))

