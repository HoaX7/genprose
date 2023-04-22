# from lib.utils.index import unlinkFile
# from lib.helpers.openai import getSamplePrompt
# from lib.Whisper.model import WhisperModel
import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES

# from uuid import uuid4
# import json

from lib.helpers.constants import TRANSCRIPTION_MODELS
from lib.Transcription.index import Transcript
import multiprocessing

"""
    - This method is used by service_worker.py to
    start the transcript extraction from downloaded audio files
"""


def extract_transcript(path, id, **kwargs):
    try:
        Content.update(
            id,
            {
                "status": PROGRESSIVE_STATUS.INPROGRESS,
                "transcript_model": f"{TRANSCRIPTION_MODELS.ASSEMBLYAI}_{TRANSCRIPTION_MODELS.DEEPGRAM}",
            },
        )
        # Calling both assembly and deepgram for testing only

        assembly_ai_process = multiprocessing.Process(
            target=transcribe_from_assembly_ai, args=(id, path)
        )
        deepgram_process = multiprocessing.Process(target=transcribe_from_deepgram, args=(id, path, False, False))
        deepgram_enhanced_process = multiprocessing.Process(target=transcribe_from_deepgram, args=(id, path, True, False))
        deepgram_nova_process = multiprocessing.Process(target=transcribe_from_deepgram, args=(id, path, False, True))

        assembly_ai_process.start()
        deepgram_process.start()
        deepgram_enhanced_process.start()
        deepgram_nova_process.start()

        assembly_ai_process.join()
        deepgram_process.join()
        deepgram_enhanced_process.join()
        deepgram_nova_process.join()

        Content.update(id, {"status": PROGRESSIVE_STATUS.COMPLETED})
        print("Processing completed...")

        # unlinkFile(path)
        # content_uid = uuid4().hex
        # args = kwargs.get("args") or {}
        # args["text"] = result["text"]
        # args["use_chatgpt_for_keywords"] = True # Set True if gpt is faster
        # args["generate_content_unique_id"] = content_uid
        # Content.update(
        #     unique_id,
        #     {
        #         "content": result["text"],
        #         "args": json.dumps(args),
        #         "status": PROGRESSIVE_STATUS.QUEUED,
        #         "content_type": CONTENT_TYPES.EXTRACT_KEYWORDS,
        #     },
        # )

        # Content.create(
        #     unique_id=content_uid,
        #     email=kwargs.get("email"),
        #     args=json.dumps(
        #         {
        #             "prompt": getSamplePrompt(result["text"]),
        #             "link": args["link"] or "",
        #         },
        #         separators=(",", ":"),
        #     ),
        #     status=PROGRESSIVE_STATUS.QUEUED,
        #     content_type=CONTENT_TYPES.EXTRACT_CONTENT,
        #     content="",
        # )
    except Exception as e:
        Content.update(
            id,
            {
                "status": PROGRESSIVE_STATUS.ERROR,
                "meta": {"error": "unknown error occured"},
            },
        )
        print("Unable to extract transcript: ", e)


def transcribe_from_assembly_ai(id: str, path: str):
    model = Transcript(path, TRANSCRIPTION_MODELS.ASSEMBLYAI)
    model.extract_transcript(id)


def transcribe_from_deepgram(id: str, path: str, premium_tier, luxury_tier):
    model = Transcript(path, TRANSCRIPTION_MODELS.DEEPGRAM, premium_tier, luxury_tier)
    model.extract_transcript(id)
