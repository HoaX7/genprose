from lib.helpers.constants import PROGRESSIVE_STATUS
from lib.helpers.adapters.transcriptAdapter import TranscriptAdapter
from lib.Logging.logger import logger
from api.assemblyai.index import (
    create_transcript,
    fetch_transcript_by_id,
    upload_audio_file,
)
import time


class AssemblyAi(TranscriptAdapter):
    def __init__(self, path: str, premium_tier: bool, luxury_tier: bool) -> None:
        self.path = path

    def extract_transcript(self):
        try:
            """
            upload the audio file to AssemblyAi which returns the
            upload path which is used in another api to start transcription.

            We must poll the api to fetch the transcript using the 'id'
            it takes 30% of the audio file time for AssemblyAi to finish
            transcribing.
            Example: 10minute audio file takes upto 3minutes to complete
            """
            audio_url = self.upload()
            logger.info(f"AssemblyAi: transcribing audio_url: {audio_url}")
            result = create_transcript(audio_url)
            self.id = result["id"]
            logger.info("AssemblyAi: transcription queued successfully")
            return result
        except FileNotFoundError:
            logger.error(
                f"AssemblyAi.extract_transcript: Failed - File does not exist: {self.filepath}"
            )
            raise Exception(
                f"Unable to extract transcript: File {self.filepath} does not exist"
            )
        except Exception as e:
            logger.error("AssemblyAi.extract_transcript: Failed - Unknown Error", e)
            raise Exception(e)

    def fetch_transcript(self, id: str):
        try:
            if not id:
                return
            result = fetch_transcript_by_id(id)
            return result
        except Exception as e:
            raise Exception(e)

    def upload(self):
        try:
            logger.info(f"AssemblyAi: uploading audio file {self.path}")
            result = upload_audio_file(self.path)
            print("file uploaded: ", result)
            return result["upload_url"]
        except Exception as e:
            raise Exception(e)

    # id - the id from contents table to save data
    def save(self):
        try:
            result = self._poll_request()
            if not result:
                return
            if result["status"] == "error":
                return {
                    "status": PROGRESSIVE_STATUS.ERROR,
                    "meta": {"error": result["error"]},
                }

            return result["text"]
        except Exception as e:
            raise Exception(e)

    def _poll_request(self, retries=10):
        while retries > 0:
            retries = retries - 1
            print(f"AssemblyAi: polling request with id: {self.id} retries: {retries}")
            try:
                result = self.fetch_transcript(self.id)
                if (
                    not result
                    or result["status"] == "completed"
                    or result["status"] == "error"
                ):
                    break

                # sleep for 30 seconds before retrying
                time.sleep(30)
            except Exception as e:
                print("poll_request: failed", e)
                break

        if retries <= 0 and not result:
            result = {"status": "error", "error": "Max retry attempts exceeded: 10"}
        return result


Model = AssemblyAi
