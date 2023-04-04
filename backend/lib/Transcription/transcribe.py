from lib.Logging.logger import logger
from lib.Openai.model import ChatGPTModel
import os
from uuid import uuid4
import lib.models.Extractor as Extractor
from lib.helpers.constants import CONTENT_TYPES
import json
from typing import Dict

content_model = ChatGPTModel()

"""
    - We are generating 'unique_id' and storing
    the necessary args with a status flag to process
    each content_type using service workers.

    - We use polling on the frontend at intervals to check if the process has
    completed.
"""


class Transcribe:

    """
    Get transcription from extractor.

    Used in api endpoint
    - Entry point for content extraction
    @returns {result["text"]: <transcript>}
    """

    def get_transcription(self, link: str, email: str) -> Dict[str, str]:
        try:
            unique_id = uuid4().hex
            Extractor.create(
                unique_id=unique_id,
                content="",
                email=email,
                args=json.dumps({"link": link}, separators=(",", ":")),
            )
            # thread = Thread(target=self.extract_audio, args=(link, unique_id))
            # thread.start()
            return unique_id
        except Exception as e:
            print(e)
            logger.error("transcribe.get_transcription: ERROR", {"error": e})
            return "Unable to transcribe this video."

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
            if (
                result
                and (result["content_type"] == CONTENT_TYPES.EXTRACT_KEYWORDS)
                or (result["content_type"] == CONTENT_TYPES.EXTRACT_CONTENT)
            ):
                result["content"] = json.loads(result["content"])
            return result
        except Exception as e:
            print(e)
            logger.error("retrieve_transcript: ERROR", {"error": e})
            return "Unable to fetch data"

    def get_by_email(self, **kwargs):
        try:
            email = kwargs.get("email")
            content_type = kwargs.get("content_type") or ""
            unique_id = kwargs.get("unique_id") or ""
            status = kwargs.get("status") or ""
            if not email:
                raise Exception("Missing 'email'")
            logger.info(
                f"transcribe.get_by_email: fetch data with emmail: {email} & unique_id: {unique_id}"
            )
            result = Extractor.get_by_email(email, content_type, unique_id, status)
            if not result:
                return []
            else:
                for entry in result:
                    if entry["args"]:
                        entry["args"] = json.loads(entry["args"])
                    # if (
                    #     entry["content_type"] == CONTENT_TYPES.EXTRACT_KEYWORDS
                    #     or entry["content_type"] == CONTENT_TYPES.EXTRACT_CONTENT
                    # ):
                    #     entry["content"] = json.loads(entry["content"])
            return result
        except Exception as e:
            print(e)
            logger.error("transcribe.get_by_email: ERROR", {"error": e})
            return "Unable to fetch data"

    def remove_transcript(self, unique_id: str):
        logger.info(f"remove_transcript: Removing data with unique_id: {unique_id}")
        try:
            Extractor.remove(unique_id)
            return
        except Exception as e:
            raise e

