import whisper
from lib.logging.logger import logger
from lib.Transcription.abstract import Transcription

model = whisper.load_model("base")

class WhisperModel(Transcription):
    def __init__(self):
        print("Initializing whisper model...")

    def get_transcription(self, audio_file: str) -> str:
        try:
            logger.info("lib.Whisper.model.get_transcription: transcription started for file: ", audio_file)
            result = model.transcribe(audio_file)
            logger.info("lib.Whisper.model.get_transcription: transcription finished for file: ", audio_file) 
            return result
        except OSError:
            logger.error("lib.Whisper.model.get_transcription: Cannot open file: ", audio_file)
            raise
        except Exception as e:
            logger.error("lib.Whisper.model.get_transcription: Unknown ERROR", e)
            raise