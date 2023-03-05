from email import utils
from lib.Logging.logger import logger
from lib.Whisper.model import WhisperModel
from lib.Extractor.AudioExtractor.youtube import extract_audio_from_url
from lib.Extractor.KeywordExtractor.model import KeywordExtractorModel
from lib.Openai.model import ChatGPTModel
import os
from uuid import uuid4
from threading import Thread
import lib.models.Extractor as Extractor
from typing import Dict
from lib.utils.index import divide_chunks
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
import json

model = WhisperModel()
content_model = ChatGPTModel()

"""
    - We are generating 'unique_id' and storing
    the necessary args with a status flag to process
    each content_type using service workers.

    - We use polling on the frontend at intervals to check if the process has
    completed.
"""
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
        Extract Audio from upload video / YT link

        - This method has been deprecated and not being used
    """
    def extract_audio(self, link: str, unique_id: str):
        try:
            audio_timer = logger.start_timer()
            filename = extract_audio_from_url(url=link, unique_id=unique_id, on_progress=on_progress, on_complete=on_complete)
            logger.end_timer("extract_audio_from_url", audio_timer) 
        except Exception as e:
            print(e)

    """
        Get transcription from extractor.

        @returns {result["text"]: <transcript>}
    """
    def get_transcription(self, link: str) -> Dict[str, str]:
        try:
            unique_id = uuid4().hex
            Extractor.create(unique_id, "", json.dumps({"link": link}, separators=(",", ":")))
            # thread = Thread(target=self.extract_audio, args=(link, unique_id))
            # thread.start()
            return unique_id
        except Exception as e:
            print(e)
            logger.error("transcribe.get_transcription: ERROR", {
                "error": e
            })
            return "Unable to transcribe this video."

    """
        - Extract keywords from audio Transcript
    """
    def extract_keywords(self, text: str, use_chatgpt_for_keywords: bool = False) -> str:
        try:
            unique_id = uuid4().hex
            Extractor.create(unique_id, "[]", json.dumps({
                "text": text,
                "use_chatgpt_for_keywords": use_chatgpt_for_keywords,
                "unique_id": unique_id
            }, separators=(",", ":")), CONTENT_TYPES.EXTRACT_KEYWORDS, PROGRESSIVE_STATUS.INPROGRESS)
            # thread = Thread(target=self.start_keyword_extraction, args=(text, use_chatgpt_for_keywords, unique_id))
            # thread.start()
            return unique_id
        except Exception as e:
            print(e)
            logger.error("transcribe.extract_keywords: ERROR", {
                "error": e
            })
            return "Unable to extract keywords", 500

    """
        - This method is used by service_worker.py
        to start keyword extraction in the queue.
    """
    def start_keyword_extraction(self, text: str, use_chatgpt_for_keywords: bool, unique_id: str):
            keyword_extractor_model = KeywordExtractorModel(use_chatgpt_for_keywords=use_chatgpt_for_keywords)
            result = keyword_extractor_model.extract_keywords(text)
            Extractor.update(unique_id, {
                "content": json.dumps(result, separators=(",", ":")),
                "args": json.dumps({"data": "consumed"})}, PROGRESSIVE_STATUS.COMPLETED)

    """
        - This method is used by service_worker.py
        to start content generation from the provided prompt.
    """
    def start_content_generation(self, prompt: str, engine: str, unique_id: str):
        logger.info("lib.Transcription.transcribe.get_content_from_keywords: generating content from prompt - ", prompt)
        content_timer = logger.start_timer()
        result = content_model.generate_content(prompt, engine)
        logger.end_timer("get_content_from_keywords", content_timer)
        Extractor.update(unique_id, {
            "content": json.dumps(result),
            "args": "{}"
        }, PROGRESSIVE_STATUS.COMPLETED)

    def get_content_from_keywords(self, prompt: str, **kwargs) -> str:
        try:
            unique_id = uuid4().hex
            engine = kwargs["engine"]
            Extractor.create(unique_id, "{}", json.dumps({
                "prompt": prompt,
                "engine": engine
            }, separators=(",", ":")),
                CONTENT_TYPES.EXTRACT_CONTENT, PROGRESSIVE_STATUS.INPROGRESS)
            # thread = Thread(target=self.start_content_generation, args=(prompt, kwargs["engine"], unique_id))
            # thread.start()
            return unique_id
        except Exception as e:
            logger.error("transcribe.get_content_from_keywords: ERROR", {
                "error": e
            })
            return "Unable to generate content"

    """
        - This method is used to fullfill
        the polling api calls from frontend
    """
    def retrieve_transcript(self, unique_id: str):
        logger.info(f"retrieve_transcript: Fetching data with unique_id: {unique_id}")
        try:
            result = Extractor.get_by_id(unique_id)
            if not result:
                return {} 

            # if result and result["status"] == PROGRESSIVE_STATUS.COMPLETED:
            #     Extractor.remove(unique_id)

            if result and result["args"]:
                result["args"] = json.loads(result["args"])
            if result and (result["content_type"] == CONTENT_TYPES.EXTRACT_KEYWORDS) or (result["content_type"] == CONTENT_TYPES.EXTRACT_CONTENT):
                result["content"] = json.loads(result["content"])
            return result
        except Exception as e:
            print(e)
            logger.error("retrieve_transcript: ERROR", {
                "error": e
            })
            return "Unable to fetch data"

    def remove_transcript(self, unique_id: str):
        logger.info(f"remove_transcript: Removing data with unique_id: {unique_id}")
        try:
            Extractor.remove(unique_id)
            return
        except Exception as e:
            raise e

    """
        - This method is used by service_worker.py to
        start the transcript extraction from downloaded audio files
    """
    def extract_transcript(self, path, unique_id):
        try:
            result = model.get_transcription(path)
            self.unlinkFile(path)
            Extractor.update(unique_id, {"content": result["text"], 
                "args": json.dumps({"data": "consumed"})}, PROGRESSIVE_STATUS.COMPLETED)
        except Exception as e:
            print("Unable to extract transcript: ", e)

"""
    These functions are callbacks that are used
    in the method on line 45
"""
def on_complete(stream, path: str, unique_id: str):
    print(f"Audio download completed - fp: {path}")
    print(unique_id)
    # result = model.get_transcription(path)
    # Stream transcript data directly from IO
    # Extractor.update(unique_id, {"content": result["text"]}, "COMPLETED")

def on_progress(chunk: bytes, file_handler, bytes_remaining: int, unique_id: str):
    print(chunk, bytes_remaining)
    print("streaming---")