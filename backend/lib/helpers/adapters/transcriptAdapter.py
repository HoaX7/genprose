from abc import ABC, abstractmethod

class TranscriptAdapter(ABC):
    def __init__(self, path: str, premium_tier: bool, luxury_tier) -> None:
        super().__init__(path, premium_tier, luxury_tier)

    @abstractmethod
    def extract_transcript(self):
        raise NotImplementedError("This abstract method has not been implemented yet")

    @abstractmethod
    def fetch_transcript(self, id: str):
        raise NotImplementedError("This abstract method has not been implemented yet")

    @abstractmethod
    def save(self):
        raise NotImplementedError("This abstract method has not been implemented yet")
