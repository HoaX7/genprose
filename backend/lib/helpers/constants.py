class _ContentTypes():
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

class _ProgressiveStatus():
    def __init__(self) -> None:
        pass

    @property
    def QUEUED(self):
        return "QUEUED"

    @property
    def INPROGRESS(self):
        return "INPROGRESS"

    @property
    def COMPLETED(self):
        return "COMPLETED"

PROGRESSIVE_STATUS = _ProgressiveStatus()
CONTENT_TYPES = _ContentTypes()