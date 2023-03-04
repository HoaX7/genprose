from pytube import YouTube
from lib.Logging.logger import logger
from lib.utils.index import make_dir_if_not_exist

"""
    Extracts audio from YT video

    @params {YT link}
    @returns {filename}
"""
def extract_audio_from_url(**kwargs) -> str:
    try:
        url = kwargs.get("url")
        logger.info("lib.Extractor.AudioExtractor.youtube: loading yt link: ", url)
        unique_id = kwargs.get("unique_id")
        on_progress = kwargs.get("on_progress")
        on_complete = kwargs.get("on_complete")

        def download_completed(*args):
            on_complete(*args, unique_id)

        def download_progress(*args):
            on_progress(*args, unique_id)

        yt = YouTube(url, on_progress_callback=download_progress, on_complete_callback=download_completed)
        # stream = yt.streams.filter(only_audio=True)[0]
        stream = yt.streams[0]

        dir_path = "downloads"
        make_dir_if_not_exist(dir_path)
        filename = yt.title
        path = f"{dir_path}/{filename}"
        print(stream)
        print("download started")
        stream.download(filename=path, skip_existing=False)
        print("download completed")
        # print(f"Downloading audio to path - {path}")
        # stream.download(filename=path, skip_existing=False)
        # print("download completed")
        logger.info(f"lib.Extractor.AudioExtractor.youtube: downloading audio file complete: -> {path}")

        return path
    except Exception as e:
        logger.error("lib.Extractor.AudioExtractor.youtube: ERROR", e)
        raise
