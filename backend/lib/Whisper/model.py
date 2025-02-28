import whisper
from lib.Logging.logger import logger
from lib.Transcription.abstract import Transcription
import os
import io
import sys

class WhisperModel(Transcription):
    def __init__(self):
        print("Initializing whisper model...")
        self.model = whisper.load_model("medium")
        print("whisper model initialized")

    def get_transcription(self, audio_file: str) -> str:
        try:
            cwd = os.getcwd()
            path = os.path.join(os.getcwd(), audio_file)

            logger.info("lib.Whisper.model.get_transcription: transcription started for file: ", audio_file)
            logger.info(f"transcribing audio from path {path}")

            result = self.model.transcribe(audio_file, verbose=True, language="English")

            logger.info("lib.Whisper.model.get_transcription: transcription finished for file: ", audio_file) 
            return result
        except OSError:
            logger.error("lib.Whisper.model.get_transcription: Cannot open file: ", audio_file)
            raise
        except Exception as e:
            logger.error("lib.Whisper.model.get_transcription: Unknown ERROR", e)
            raise

    def extract_from_raw_audio_chunk(self, chunk):
        result = self.model.transcribe(chunk)
        return result