from pytube import YouTube
from lib.logging.logger import logger
from lib.utils.index import make_dir_if_not_exist

"""
    Extracts audio from YT video

    @params {YT link}
    @returns {filename}
"""
def extract_audio_from_url(url: str) -> str:
    try:
        logger.info("lib.Extractor.AudioExtractor.youtube: loading yt link: ", url)
        # load YT link to be transcribed
        yt = YouTube(url)
        stream = yt.streams.filter(only_audio=True)[0]

        dir_path = "downloads"
        make_dir_if_not_exist(dir_path)
        filename = "audio.mp3"
        path = f"{dir_path}/{filename}"
        stream.download(filename=path)
        logger.info(f"lib.Extractor.AudioExtractor.youtube: downloading audio file complete: -> {path}")
        return path
    except Exception as e:
        logger.error("lib.Extractor.AudioExtractor.youtube: ERROR", e)
        raise
