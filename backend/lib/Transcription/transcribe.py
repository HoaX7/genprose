from lib.helpers.constants import getSamplePrompt
from lib.Logging.logger import logger
from lib.Whisper.model import WhisperModel
from lib.Openai.model import ChatGPTModel
import os
from uuid import uuid4
import lib.models.Extractor as Extractor
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
import json
from typing import Dict

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

    """
        - This method is used by service_worker.py to
        start the transcript extraction from downloaded audio files
    """

    def extract_transcript(self, path, unique_id, **kwargs):
        try:
            Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.INPROGRESS})
            result = model.get_transcription(path)
            # self.unlinkFile(path)
            
            content_uid = uuid4().hex
            args = kwargs.get("args") or {}
            args["text"] = result["text"]
            args["use_chatgpt_for_keywords"] = True # Set True if gpt is faster
            args["generate_content_unique_id"] = content_uid
            Extractor.update(
                unique_id,
                {
                    "content": result["text"],
                    "args": json.dumps(args),
                    "status": PROGRESSIVE_STATUS.QUEUED,
                    "content_type": CONTENT_TYPES.EXTRACT_KEYWORDS,
                },
            )

            Extractor.create(
                unique_id=content_uid,
                email=kwargs.get("email"),
                args=json.dumps(
                    {
                        "prompt": getSamplePrompt(result["text"]),
                        "link": args["link"] or "",
                    },
                    separators=(",", ":"),
                ),
                status=PROGRESSIVE_STATUS.QUEUED,
                content_type=CONTENT_TYPES.EXTRACT_CONTENT,
                content="",
            )
        except Exception as e:
            Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.QUEUED})
            print("Unable to extract transcript: ", e)
