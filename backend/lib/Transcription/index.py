from asyncio.log import logger
from lib.helpers.constants import TRANSCRIPTION_MODELS
import importlib

class Transcript():
    """
        This class chooses from multiple 3rd party models available
        to transcribe audio files.
        There are currently 3 models available:

        - AssemblyAi (https://www.assemblyai.com/docs)
        - Deepgram (https://developers.deepgram.com/documentation)
        - In-house Whisper Ai
    """
    def __init__(self, filepath: str, model = TRANSCRIPTION_MODELS.DEFAULT, premium_tier=False, luxury_tier=False) -> None:
        # import the required modules based on selected model
        module_name = ""
        if model == TRANSCRIPTION_MODELS.ASSEMBLYAI:
            module_name = "module.AssemblyAi.index"
        elif model == TRANSCRIPTION_MODELS.DEEPGRAM:
            module_name = "module.Deepgram.index"
        else:
            raise Exception("The specified Model was not found", f"Expected one of: {TRANSCRIPTION_MODELS.ASSEMBLYAI}, {TRANSCRIPTION_MODELS.DEEPGRAM}")

        logger.info(f"Transcript: loading module: {module_name}")
        """
            Deepgram Includes 4 models.
            We choose the best model based on premium_tier or luxury_tier
        """
        module = importlib.import_module(module_name)
        self.model = module.Model(filepath, premium_tier, luxury_tier) # path, premium_tier, luxury_tier

    # id - The id from 'contents' table
    def extract_transcript(self, id: str):
        self.model.extract_transcript()
        self.model.save(id)
