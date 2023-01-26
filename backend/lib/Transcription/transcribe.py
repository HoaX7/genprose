from lib.logging.logger import logger
from lib.Whisper.model import WhisperModel
from lib.Extractor.AudioExtractor.youtube import extract_audio_from_url
from lib.Extractor.KeywordExtractor.tfidf import TFIdfModel
from lib.Openai.model import ChatGPTModel
import os

model = WhisperModel()
keyword_extractor_model = TFIdfModel()
content_model = ChatGPTModel()

class Transcribe:
    def unlinkFile(self, filename: str) -> None:
        try:
            if os.path.isfile(filename):
                print("File removed - ", filename)
                os.remove(filename)
            else:
                print("File does not exist - ", filename)
            return True
        except Exception as e:
            print(e)
            return "Unable to remove file"

    """
        Get transcription from extractor.

        @returns {result["text"]: <transcript>}
    """
    def get_transcription(self, link: str) -> {
        "text": str
    }:
        try:
            # extract audio and fetch filename
            # to transcribe
            filename = extract_audio_from_url(link)
            result = model.get_transcription(filename)
            self.unlinkFile(filename)
            return result
        except:
            return "Unable to transcribe this video."

    def extract_keywords(self, text: str) -> str:
        try:
            return keyword_extractor_model.extract_keywords(text)
        except Exception as e:
            print(e)
            return "Unable to extract keywords"

    def get_content_from_keywords(self, prompt: str) -> str:
        try:
            logger.info("lib.Transcription.transcribe.get_content_from_keywords: generating content from prompt - ", prompt)
            return content_model.generate_content(prompt)
        except Exception as e:
            print(e)
            return "Unable to generate content"
