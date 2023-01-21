from abc import ABC, abstractmethod

class Transcription(ABC):
    def __init__(self) -> None:
        pass

    @abstractmethod
    def get_transcription(str: str) -> str:
        raise Exception("Unimplemented")