class __ContentTypes():
    def __init__(self) -> None:
        pass

    @property
    def EXTRACT_AUDIO(self):
        return "EXTRACT_AUDIO"

    @property
    def EXTRACT_KEYWORDS(self):
        return "EXTRACT_KEYWORDS"

    @property
    def EXTRACT_CONTENT(self):
        return "EXTRACT_CONTENT"

    @property
    def EXTRACT_TRANSCRIPT(self):
        return "EXTRACT_TRANSCRIPT"

class __ProgressiveStatus():
    def __init__(self) -> None:
        pass

    @property
    def QUEUED(self):
        return "QUEUED"

    @property
    def PRIORITY_QUEUE(self):
        return "PRIORITY_QUEUE"

    @property
    def INPROGRESS(self):
        return "INPROGRESS"

    @property
    def COMPLETED(self):
        return "COMPLETED"

"""
    -DISCLAIMER This is a Trial Prompt we could generate as an example
    to show our generative content to the user
"""
def getSamplePrompt(text: str):
    return f"Consider the given context and generate a 250 word essay using the transcript of a video: {text}"

PROGRESSIVE_STATUS = __ProgressiveStatus()
CONTENT_TYPES = __ContentTypes()

CONTENT_TYPE_LIST = [CONTENT_TYPES.EXTRACT_AUDIO, CONTENT_TYPES.EXTRACT_KEYWORDS, CONTENT_TYPES.EXTRACT_CONTENT, CONTENT_TYPES.EXTRACT_TRANSCRIPT]