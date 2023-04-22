"""
    Wrapper for http(s) requester to make external API calls

    Current implementation uses 'requests' lib 
"""
from asyncio.log import logger
import requests
import os
from lib.helpers.constants import TRANSCRIPTION_MODELS

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
# if `isFile` is True then pass the filename to data param
def make_request(**kwargs):
    try:
        url = kwargs.get("url")
        service = kwargs.get("service")
        version = kwargs.get("version")
        method = kwargs.get("method") or "GET"
        data = kwargs.get("data") or None
        headers = kwargs.get("headers") or {}
        isFile = kwargs.get("isFile") or False

        url = __prepareUrlStr(url, service, version)

        if service == TRANSCRIPTION_MODELS.ASSEMBLYAI:
            headers.update({
                "authorization": ASSEMBLYAI_API_KEY
            })

        print(f"requester: calling external API: [{method}] {url}")
        """Make a GET,PUT,POST,DELETE request to the specified URL with optional query parameters."""
        if method == "GET":
            response = requests.get(url, params=data, headers=headers)
        elif method == "POST":
            if isFile:
                def read_file(filename: str):
                    chunk_size = 5242880
                    with open(filename, 'rb') as _file:
                        while True:
                            data = _file.read(chunk_size)
                            print("streaming file upload...")
                            if not data:
                                break
                            yield data
                response = requests.post(url, headers=headers, data=read_file(data))
            else:
                response = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            requests.put(url, json=data, headers=headers)
        elif method == "PATCH":
            requests.patch(url, data=data, headers=headers)
        return response.json()
    except Exception as e:
        raise Exception("Request Failed: Unknown Error occured", e)

def __prepareUrlStr(url: str, service = "", version = "") -> str:
    baseurl = ""
    if service == TRANSCRIPTION_MODELS.ASSEMBLYAI:
        baseurl = TRANSCRIPTION_MODELS.ASSEMBLYAI_BASE_URL
    
    if version:
        baseurl += f"/{version}"
    
    return f"{baseurl}/{url}"