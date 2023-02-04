from lib.logging.logger import logger
from lib.Whisper.model import WhisperModel
from lib.Extractor.AudioExtractor.youtube import extract_audio_from_url
from lib.Extractor.KeywordExtractor.model import KeywordExtractorModel
from lib.Openai.model import ChatGPTModel
import os

model = WhisperModel()
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
            audio_timer = logger.start_timer()
            filename = extract_audio_from_url(link)
            logger.end_timer("extract_audio_from_url", audio_timer)

            transcript_timer = logger.start_timer()
            result = model.get_transcription(filename)
            logger.end_timer("get_transcription", transcript_timer)
            self.unlinkFile(filename)
            return result
        except:
            logger.error("transcribe.get_transcription: ERROR", {
                "error": e
            })
            return "Unable to transcribe this video."

    def extract_keywords(self, text: str, use_chatgpt_for_keywords: bool = False) -> str:
        try:
            keyword_extractor_model = KeywordExtractorModel(use_chatgpt_for_keywords=use_chatgpt_for_keywords)
            return keyword_extractor_model.extract_keywords(text)
        except Exception as e:
            logger.error("transcribe.extract_keywords: ERROR", {
                "error": e
            })
            return "Unable to extract keywords"

    def get_content_from_keywords(self, prompt: str, **kwargs) -> str:
        try:
            logger.info("lib.Transcription.transcribe.get_content_from_keywords: generating content from prompt - ", prompt)
            content_timer = logger.start_timer()
            result = content_model.generate_content(prompt, kwargs["engine"])
            logger.end_timer("get_content_from_keywords", content_timer)
            return result
        except Exception as e:
            logger.error("transcribe.get_content_from_keywords: ERROR", {
                "error": e
            })
            return "Unable to generate content"
