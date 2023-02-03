from abc import ABC, abstractmethod

class LogAbstract(ABC):
    def __init__(self) -> None:
        raise Exception("Unimplemented")

    @abstractmethod
    def info(*args, **kwargs) -> None:
        raise Exception("Unimplemented")

    @abstractmethod
    def error(*args, **kwargs) -> None:
        raise Exception("Unimplemented")

    @abstractmethod
    def warn(*args, **kwargs) -> None:
        raise Exception("Unimplemented")
