# Backend Service

- Steps to start service
`cd backend/`
`. venv/bin/activate`
`pip install`
`flask --app app/app.py (--debug) run`

## Installing tokenizers on Mac M1
Follow instructions in this link to install whisper deps (tokenizers) on Mac M1
https://towardsdatascience.com/hugging-face-transformers-on-apple-m1-26f0705874d7
https://github.com/openai/whisper/discussions/10

# Example
https://medium.com/nlplanet/transcribing-youtube-videos-with-whisper-in-a-few-lines-of-code-f57f27596a55

# Common Errors
- "Whisper moddel not able to open audio file"
the fix is to install ffmpeg using ``apt install ffmpeg``

- If there are problems installing google-cloud-logging
error message - "moduleNotFound - google"
this can be fixed by installing ``pip install google-cloud``

- export 'OPENAI_API_KEY' for service_worker.py to generate content