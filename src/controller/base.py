from fastapi import APIRouter
from abc import ABC, abstractmethod

class BaseController(ABC):

    def __init__(self, prefix: str) -> None:
        self.prefix = f"/api/{prefix}"
        self.controller = APIRouter(prefix=self.prefix)
    
    @abstractmethod
    def initialize_and_get_controller(self) -> APIRouter:
        pass
