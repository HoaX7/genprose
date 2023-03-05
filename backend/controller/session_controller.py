from flask import make_response

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
def set_session(value) -> None:
    resp = make_response("Session authorized")
    # JWT token generated for 'value'
    resp.set_cookie("token", "==" + value, max_age=None, expires=None, path='/', 
    domain=None, secure=False, httponly=True)
    return resp
