from lib.helpers.constants import TRANSCRIPTION_MODELS
from lib.helpers.requester import make_request


def create_transcript(path: str):
    return make_request(
        url="transcript",
        service=TRANSCRIPTION_MODELS.ASSEMBLYAI,
        version="v2",
        method="POST",
        data={
            "audio_url": path,
            "language_code": "en",
            # Enabling summary costs extra
            # read @docs (https://www.assemblyai.com/pricing) for more info
            # "summarization": True,
            # "summary_model": "informative",
        },
    )


def fetch_transcript_by_id(id: str):
    return make_request(
        url=f"transcript/{id}",
        service=TRANSCRIPTION_MODELS.ASSEMBLYAI,
        version="v2",
        method="GET",
        data={},
    )


def upload_audio_file(filepath: str):
    return make_request(
        url=f"upload",
        service=TRANSCRIPTION_MODELS.ASSEMBLYAI,
        version="v2",
        method="POST",
        data=filepath,
        isFile=True,
    )
