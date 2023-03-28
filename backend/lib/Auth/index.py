from flask import request
import functools
from lib.Logging.logger import logger
import json


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
            __token = ""
            if token:
                __token = token.split(":")
            elif __cookies:
                temp = json.loads(__cookies)
                if temp["token"]:
                    __token = temp["token"].split(":")

            if __token and verify_token(__token):
                return func(*args, **kwargs)

            return "Unauthorized", 401
        except Exception as e:
            print(e)
            return "Unauthorized", 401

    return secure_function


def verify_token(token: list[str]) -> bool:
    secret = token[0].split("secret=")[1]
    email = token[1].split("email=")[1]
    if secret == "AAAA":
        request.user = {"email": email}
        return True
    return False
