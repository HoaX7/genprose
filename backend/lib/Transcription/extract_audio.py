from lib.Extractor.AudioExtractor.youtube import extract_audio_from_url
from lib.Logging.logger import logger

"""
    Extract Audio from upload video / YT link

    - This method has been deprecated and not being used
"""

def extract_audio(self, link: str, unique_id: str):
    try:
        audio_timer = logger.start_timer()
        filename = extract_audio_from_url(
            url=link,
            unique_id=unique_id,
            on_progress=on_progress,
            on_complete=on_complete,
        )
        logger.end_timer("extract_audio_from_url", audio_timer)
    except Exception as e:
        print(e)

"""
    These functions are callbacks that are used
    in the method on line 12
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