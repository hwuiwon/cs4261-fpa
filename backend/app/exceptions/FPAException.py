from abc import abstractmethod
from enum import Enum


class FPAExceptionCode(Enum):
    BAD_REQUEST = 400
    UNPROCESSABLE_ENTITY = 900


class FPAException(Exception):
    def __init__(self, code: Enum, message: str):
        self.code = code
        self.message = message

    @abstractmethod
    def __str__(self):
        pass

    @abstractmethod
    def __repr__(self):
        pass
