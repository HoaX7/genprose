from Logging.logger import logger
from flask import Blueprint, make_response, request
import app.Controllers.transcript_controller as Transcription

backend_service = Blueprint("backend_service", __name__)

@backend_service.route("/", methods=["GET"])
def main() -> str:
    return "Backend service", 200

@backend_service.route("/transcribe", methods={"POST"})
def load_transcription():
    try:
        data = request.json
        if not data["url"]:
            return "Expected 'url' property in JSON body", 422

        result = Transcription.get_yt_video_from_url(data["url"])
        logger.info("routes.service.load_transcription: result", result)
        return result["text"], 200
    except Exception as e:
        print(e)
        logger.error("routes.service.load_transcription: ERROR", e)
        return "Invalid JSON body", 400