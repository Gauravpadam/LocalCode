from fastapi import FastAPI
from controller.problemController import ProblemController
from config import Config

import uvicorn

app = FastAPI()
app.include_router(ProblemController().initialize_and_get_controller())


if __name__ == '__main__':
    uvicorn.run(app=app, host=Config.API_HOST, port=int(Config.API_PORT))

