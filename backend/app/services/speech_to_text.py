"""
Speech-to-Text Service (STUB)

Voice-to-text is now handled CLIENT-SIDE in the browser via the Web Speech
API (see frontend/src/hooks/useSpeechToText.js) — free, no API key needed,
no audio ever leaves the user's device for transcription purposes.

This backend function is kept only as a stub so that intake.py's
audio_base64 code path (an alternate/legacy path where raw audio bytes are
sent to the backend) doesn't crash on import or on call. It is not currently
used by the actual demo flow. If server-side transcription is needed later
(e.g. for a mobile app that can't use the browser API), a real ASR
integration (Whisper, Google Speech-to-Text, etc.) can be wired in here.
"""


def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Stub transcription function. Real transcription happens client-side.

    Args:
        audio_bytes: Raw audio file bytes (unused by this stub)

    Returns:
        Placeholder string — this path is not exercised by the current
        frontend, which sends already-transcribed text instead.
    """
    return "[Voice transcription is handled client-side in the browser; this backend path is currently a stub]"