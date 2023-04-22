from lib.models.User import find
from flask import request
import functools
from lib.Logging.logger import logger
import json
from controller.session_controller import verify_jwt_token


def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        try:
            """
            #TODO - Safari is rejecting set cookie
            when using ngrok. Need to verify authentication
            when using a domain.

            #TODO - Use JWT to encode - decode details
            """
            token = request.cookies.get("token")
            __cookies = request.headers.get("Cookies")

            if not token and __cookies:
                temp = json.loads(__cookies)
                if temp["token"]:
                    token = temp["token"]
            
            if token and verify_token(token):
                return func(*args, **kwargs)

            return "Unauthorized", 401
        except Exception as e:
            print(e)
            return "Unauthorized", 401

    return secure_function


def verify_token(token: str) -> bool:
    data = verify_jwt_token(token)
    if not data:
        return False

    existing_user = find(data["email"])
    if not existing_user or existing_user["id"] != data["id"]:
        return False

    request.user = data
    return True
