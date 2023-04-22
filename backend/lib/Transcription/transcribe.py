from lib.Logging.logger import logger
import os
from uuid import uuid4
import lib.models.Content as Content
from lib.helpers.constants import CONTENT_TYPES
import json
from typing import Dict

"""
    - We are generating 'unique_id' and storing
    the necessary args with a status flag to process
    each content_type using service workers.

    - We use polling on the frontend at intervals to check if the process has
    completed.
"""


class Transcribe:

    """
    Get transcription from Content.

    Used in api endpoint
    - Entry point for content extraction
    @returns {result["text"]: <transcript>}
    """

    def get_transcription(self, link: str, user_id: str) -> str:
        try:
            id = Content.create(
                user_id=user_id,
                args={"link": link},
                content_type=CONTENT_TYPES.EXTRACT_AUDIO
            )
            logger.info(f"transcribe.get_transcript: Queued 'audio download' task with id: {id}")
            return id
        except Exception as e:
            print(e)
            logger.error("transcribe.get_transcription: ERROR", {"error": e})
            return "Unable to transcribe this video."

    """
        - This method is used to fullfill
        the polling api calls from frontend
    """

    def retrieve_transcript(self, id: str):
        logger.info(f"retrieve_transcript: Fetching data with unique_id: {id}")
        try:
            result = Content.get_by_id(id)
            if not result:
                return {}
            return result
        except Exception as e:
            print(e)
            logger.error("retrieve_transcript: ERROR", {"error": e})
            return "Unable to fetch data"

    def get_by_user(self, **kwargs):
        try:
            user_id = kwargs.get("user_id")
            content_type = kwargs.get("content_type") or ""
            id = kwargs.get("id") or ""
            status = kwargs.get("status") or ""
            if not user_id:
                raise Exception("Missing 'user_id'")
            logger.info(
                f"transcribe.get_by_user: fetch data with userid: {user_id} & id: {id}"
            )
            result = Content.get_by_user_id(user_id, content_type, id, status)
            if not result:
                return []
            return result
        except Exception as e:
            print(e)
            logger.error("transcribe.get_by_user: ERROR", {"error": e})
            return "Unable to fetch data"

    def remove_transcript(self, id: str):
        logger.info(f"remove_transcript: Removing data with unique_id: {id}")
        try:
            # Content.remove(unique_id)
            return
        except Exception as e:
            raise e

