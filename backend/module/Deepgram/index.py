from lib.helpers.adapters.transcriptAdapter import TranscriptAdapter
from lib.Logging.logger import logger
from deepgram import Deepgram
import os
import time

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

"""
    Deepgram Ai offers varios models and tier(s) to Transcribe from
    see docs: https://developers.deepgram.com/documentation/features

    Pricing also depends on the type of model used.
    Current Model used:
    - model: general
    - tier: enhanced
    - price for nova tier: $0.0044 / minute (highest)
"""
class DeepgramAi(TranscriptAdapter):
    def __init__(self, path: str, premium_tier: bool, luxury_tier: bool) -> None:
        self.path = path
        self.model = Deepgram(DEEPGRAM_API_KEY)

        if luxury_tier == True:
            self.tier = "nova"
        elif premium_tier == True:
            self.tier = "enhanced"
        else:
            self.tier = "base"
        print("Deepgram model initialized")

    def extract_transcript(self):
        try:
            logger.info("Deepgram: Transcribing audio file: ", self.path)
            with open(self.path, "rb") as audio:
                """
                    The response returned has a lot more information
                    such as confidence and words detected.

                    We are currently only returning the transcript
                """
                start_time = time.time()
                source = {"buffer": audio, "mimetype": "audio/mp3"}
                response = self.model.transcription.sync_prerecorded(
                    source, {"punctuate": True, "language": "en", "model": self.tier}
                )
                result = response["results"]["channels"][0]["alternatives"][0]["transcript"]
                time_taken = time.time() - start_time
                logger.info(f"Deepgram: Transcript extraction took: {time_taken}s")
                # logger.info("Deepgram: Transcript generated with result: ", {
                #     "result": result,
                #     "response": response
                # })
                self.result = result
                return result
        except FileNotFoundError:
            logger.error(
                f"Deepgram.extract_transcript: Failed - File does not exist: {self.path}"
            )
            raise Exception(
                f"Unable to extract transcript: File {self.path} does not exist"
            )
        except Exception as e:
            logger.error("Deepgram.extract_transcript: Failed - Unknown Error", e)
            raise Exception(e)

    def fetch_transcript(self):
        return

    def save(self):
        data = {}
        key = f"deepgram_{self.tier}"
        data[key] = {
            "transcript": self.result
        }
        print("deepgram.save: saving transcript...")
        return data


Model = DeepgramAi
