"""
Voice Analyzer - Mock Speech Feature Extraction

Generates realistic-looking voice stress indicators from audio.
In production, use Librosa (pitch, MFCC) + scipy (pause detection) + speech rate analysis.

For the prototype, we return plausible mock values structured for easy real implementation.
"""

import random


def analyze_voice(audio_bytes: bytes) -> dict:
    """
    Analyze voice features from raw audio bytes.

    Args:
        audio_bytes (bytes): Raw audio data (WAV, MP3, etc.)

    Returns:
        dict: {
            pitch_variance (float): 0-100 (higher = more unstable/stressed),
            pause_length (float): 0-5 (avg seconds between words),
            speech_rate (float): words per minute,
            stress_score (float): 0-100 combined stress indicator,
        }

    PRODUCTION IMPLEMENTATION:
    - Use Librosa to extract pitch contour and compute variance
    - Use scipy.signal for pitch detection (autocorrelation)
    - Detect pauses via silence threshold
    - Compute speech rate from word boundaries (VAD)
    - Combine features into final stress score
    """

    # MOCK VALUES for demo
    # In reality, these would be computed from audio signal processing
    pitch_variance = random.uniform(30, 95)  # Higher = more stressed
    pause_length = random.uniform(0.2, 2.0)  # Avg seconds between words
    speech_rate = random.uniform(100, 200)  # Words per minute

    # Combine into stress score
    # Stressed speech: higher pitch variance, longer pauses, faster rate
    stress_from_pitch = pitch_variance * 0.4
    stress_from_pauses = min(pause_length * 20, 100) * 0.3  # Longer pauses = more stressed
    stress_from_rate = ((speech_rate - 100) / 100) * 30  # Deviation from normal = stress

    stress_score = min(100, stress_from_pitch + stress_from_pauses + stress_from_rate)

    return {
        "pitch_variance": round(pitch_variance, 2),
        "pause_length": round(pause_length, 2),
        "speech_rate": round(speech_rate, 2),
        "stress_score": round(stress_score, 2),
    }
