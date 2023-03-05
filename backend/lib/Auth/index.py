from flask import request
import functools

def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        """
            #TODO - Safari is rejecting set cookie
            when using ngrok. Need to verify authentication
            when using a domain.
        """
        # token = request.cookies.get("token")
        token = "==AAAA"
        if token and verify_token(token):
            return func(*args, **kwargs)

        return "Unauthorized", 401

    return secure_function

def verify_token(token: str) -> bool:
    if token == "==AAAA":
        return True
    return False
