"""
Speech-to-Text Service

Transcribes voice audio to text using OpenAI's Whisper API.
Accepts raw audio bytes (matches the calling signature in routes/intake.py,
which decodes audio_base64 into bytes before calling this function).
"""

import os
import io
from openai import OpenAI

# Initialize client lazily to avoid errors during import if key is missing
client = None

def _get_client():
    global client
    if client is None:
        api_key = os.getenv("OPENAI_API_KEY", "sk-dummy-key-for-testing")
        client = OpenAI(api_key=api_key)
    return client


def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Transcribe raw audio bytes to text using Whisper.

    Args:
        audio_bytes: Raw audio file bytes (e.g. webm/wav/mp3 from browser recording)

    Returns:
        Transcribed text string.

    NOTE: audio_bytes is never written to persistent disk storage here — it's
    wrapped in an in-memory buffer, sent to the Whisper API, and discarded once
    this function returns. This matches the privacy requirement in intake.py
    (no raw audio retained after transcription/analysis).
    """
    if not os.getenv("OPENAI_API_KEY"):
        # Fallback so the demo doesn't crash if the key isn't configured yet
        return "[Mock transcript — OPENAI_API_KEY not configured]"

    # Whisper's API needs a file-like object with a name attribute (for format detection)
    audio_buffer = io.BytesIO(audio_bytes)
    audio_buffer.name = "recording.webm"  # extension hints the format to the API

    try:
        client = _get_client()
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_buffer,
        )
        return result.text
    except Exception as e:
        raise RuntimeError(f"Whisper transcription failed: {str(e)}")
