from fastapi import FastAPI
from config import Config
import uvicorn

app = FastAPI()

if __name__ == '__main__':
    uvicorn.run(app=app, host=Config.API_HOST, port=Config.API_PORT, reload=Config.ENV.is_dev)

