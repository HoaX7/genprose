from lib.Logging.logger import logger
from flask import Blueprint, make_response, request
from controller import transcript_controller as Transcription
from controller.session_controller import set_session
from lib.Auth.index import login_required

backend_service = Blueprint("backend_service", __name__)

@backend_service.route("/", methods=["GET"])
def main() -> str:
    return "Backend service", 200

@backend_service.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data["secret_code"]:
            return "Invalid secret code provided", 401
        
        if data["secret_code"] != "AAAA":
            return "Invalid secret code provided", 401

        return set_session("AAAA")
    except Exception as e:
        print(e)
        logger.error("lib.routes.service.login: ERROR", e)
        return "Unable to login", 500
