from lib.Logging.logger import logger
from flask import Blueprint, make_response, request
from controller import transcript_controller as Transcription
import json

backend_service = Blueprint("backend_service", __name__)

@backend_service.route("/", methods=["GET"])
def main() -> str:
    return "Backend service", 200
