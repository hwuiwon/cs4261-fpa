from enum import Enum

from .FPAException import FPAException


class FPADBExceptionCode(Enum):
    ITEM_PUT_ERROR = 4001
    ITEM_UPDATE_ERROR = 4002
    ITEM_BATCH_GET_ERROR = 4003
    ITEM_BATCH_PUT_ERROR = 4004
    ITEM_BATCH_PROCESS_ERROR = 4005
    ITEM_DOES_NOT_EXIST = 4006
    USER_DOES_NOT_EXIST = 4007

    NOT_ENOUGH_PERMISSION = 4201

    INVALID_ARGUMENT = 4501


class FPADBException(FPAException):
    def __init__(self, code: FPADBExceptionCode, message: str):
        self.code = code
        self.message = message

    def __str__(self):
        return f"FPADBException: [{self.code.value}] {self.code.name}: {self.message}"

    def __repr__(self):
        return f"FPADBException: [{self.code.value}] {self.code.name}: {self.message}"
