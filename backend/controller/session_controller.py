from __future__ import annotations
from typing import Literal
from lib.models.User import User
from flask import make_response
import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

"""
    Generate a JWT session cookie to be set in response header
    
    A session is considered valid when the following property
    is sent in the request header to access protected routes.
    'Authorization' = 'Bearer <token>'

    # Format
    Response.set_cookie(key, value='', max_age=None, expires=None, path='/', 
    domain=None, secure=None, httponly=False)
    Note: 'secure' must be True while using https.

    Note: While using ngrok to server backend
    "secure" must be True and samesite="None"
"""
def set_session(value):
    token = jwt.encode(value, SECRET_KEY, algorithm="HS256")
    resp = make_response("Session authorized")
    resp.set_cookie("token", token, max_age=None, expires=None, path='/', 
    domain=None, secure=False, httponly=True)
    return resp

def revoke_session():
    resp = make_response("Session Expired")
    resp.set_cookie("token", "", expires=0)
    return resp

# Function to verify JWT token
def verify_jwt_token(token: str) -> (User | Literal[False]):
    try:
        # Decode the token and get the data
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return data
    except jwt.ExpiredSignatureError:
        # Handle expired token
        print("Error: Token has expired.")
        return False
    except jwt.InvalidTokenError:
        # Handle invalid token
        print("Error: Invalid token.")
        return False
    except Exception as e:
        print("Unknown Error: ", e)
        return False