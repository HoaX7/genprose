from lib.Logging.logger import logger
from flask import Blueprint, make_response, request
from controller import transcript_controller as Transcription
from controller.session_controller import set_session, revoke_session
from lib.Auth.index import login_required
from lib.models.User import find, create

auth_service = Blueprint("auth_service", __name__)

"""
    #TODO - Encode session details in JWT
"""
@auth_service.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data["secret_code"] or data["secret_code"] != "AAAA":
            return "Invalid secret code provided", 401
        if not data["email"]:
            return "Please enter a valid email", 401

        user = find(data["email"])
        if not user:
            user = create(data["email"])
        return set_session(user)
    except Exception as e:
        print(e)
        logger.error("lib.routes.auth.login: ERROR", e)
        return "Unable to login", 500

@auth_service.route("/logout", methods=["POST"])
@login_required
def logout():
    try:
        return revoke_session()
    except Exception as e:
        print(e)
        return "Unable to logout", 500