class __ContentTypes:
    def __init__(self) -> None:
        pass

    EXTRACT_AUDIO = "EXTRACT_AUDIO"
    EXTRACT_CONTENT = "EXTRACT_CONTENT"
    EXTRACT_KEYWORDS = "EXTRACT_KEYWORDS"
    EXTRACT_TRANSCRIPT = "EXTRACT_TRANSCRIPT"


class __ProgressiveStatus:
    def __init__(self) -> None:
        pass

    QUEUED = "QUEUED"
    PRIORITY_QUEUE = "PRIORITY_QUEUE"
    INPROGRESS = "INPROGRESS"
    COMPLETED = "COMPLETED"
    ERROR = "ERROR"

class __Persona:
    def __init__(self) -> None:
        pass

    FIN_BIZ = "Business / Financial"
    CONTENT_CREATOR = "Content Creator"
    MARKETING = "Marketing"
    FASHION_DESIGNER = "Fashion Design"
    MEDICAL = "Medical"
    IT = "Technology"

class __Tone:
    def __init__(self) -> None:
        pass

    PASSIVE = "Passive"
    AGGRESSIVE = "Aggressive"
    AUTHORITATIVE = "Authoritative"

class __TranscriptionModels:
    def __init__(self) -> None:
        pass

    ASSEMBLYAI = "ASSEMBLYAI"
    DEEPGRAM = "DEEPGRAM"
    DEFAULT = "DEFAULT"

    ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com"

PROGRESSIVE_STATUS = __ProgressiveStatus()
CONTENT_TYPES = __ContentTypes()
TRANSCRIPTION_MODELS = __TranscriptionModels()
TONE = __Tone()
PERSONA = __Persona()

CONTENT_TYPE_LIST = [
    CONTENT_TYPES.EXTRACT_AUDIO,
    CONTENT_TYPES.EXTRACT_KEYWORDS,
    CONTENT_TYPES.EXTRACT_CONTENT,
    CONTENT_TYPES.EXTRACT_TRANSCRIPT,
]
PROGRESS_STATUS_LIST = [
    PROGRESSIVE_STATUS.QUEUED,
    PROGRESSIVE_STATUS.INPROGRESS,
    PROGRESSIVE_STATUS.COMPLETED,
    PROGRESSIVE_STATUS.ERROR,
    PROGRESSIVE_STATUS.PRIORITY_QUEUE,
]
