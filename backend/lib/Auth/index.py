from flask import request
import functools

def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        auth_string = request.headers.get("Authorization")
        if auth_string:
            token = auth_string.split("Bearer ")[1]
            if token and verify_token(token):
                return func(*args, **kwargs)

        return "Unauthorized", 401

    return secure_function

def verify_token(token: str) -> bool:
    if token == "==AAAA":
        return True
    return False
