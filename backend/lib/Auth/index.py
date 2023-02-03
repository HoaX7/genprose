from flask import request
import functools

def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        token = request.cookies.get("token")
        if token and verify_token(token):
            return func(*args, **kwargs)

        return "Unauthorized", 401

    return secure_function

def verify_token(token: str) -> bool:
    if token == "==AAAA":
        return True
    return False
