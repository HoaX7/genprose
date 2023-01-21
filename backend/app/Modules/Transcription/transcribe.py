from Logging.logger import logger
from app.Models.Whisper.model import WhisperModel
from pytube import YouTube

model = WhisperModel()

class Transcribe:
    def load_yt_link(self, link: str):
        try:
            logger.info("Modules.Transcription.transcribe.load_yt_link: loading yt link: ", link)
            # load YT link to be transcribed
            yt = YouTube(link)
            return yt
        except Exception as e:
            logger.error("Modules.Transcription.transcribe.load_yt_link: Connection Error", e)
            return

    def get_transcription(self, link: str):
        try:
            # download YT audio only
            yt = self.load_yt_link(link)
            stream = yt.streams.filter(only_audio=True)[0]
            stream.download(filename="audio.mp3")
            result = model.get_transcription("audio.mp3")
            return result
        except:
            return "Unable to transcribe this video."
