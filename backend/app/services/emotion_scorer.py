"""
Emotion Scorer - Lexicon-based emotion detection

Detects emotions (fear, anger, desperation, etc.) via keyword matching.
Structured to swap in a real transformer model (e.g., DistilBERT emotion classifier) later.
"""

# Emotion keyword lexicons
FEAR_KEYWORDS = {
    "afraid", "fear", "scared", "terrified", "panic", "anxiety", "anxious",
    "worry", "worried", "dread", "horrified", "threat", "threatened",
}

ANGER_KEYWORDS = {
    "angry", "rage", "furious", "enraged", "hate", "despise", "resentment",
    "bitter", "hostile", "aggressive", "violent", "attack", "harm",
}

DESPERATION_KEYWORDS = {
    "desperate", "hopeless", "helpless", "worthless", "useless", "fail",
    "failure", "lost", "alone", "abandoned", "trapped", "stuck",
}

SADNESS_KEYWORDS = {
    "sad", "depression", "depressed", "grief", "loss", "mourn", "suffer",
    "pain", "ache", "misery", "unhappy", "devastated", "broken",
}


def score_emotion(text: str) -> float:
    """
    Score emotional intensity from text (0-100 scale).
    0 = no strong emotions, 100 = extreme emotional intensity.

    Args:
        text (str): Input text to analyze

    Returns:
        float: Emotion score 0-100
    """
    if not text or len(text.strip()) == 0:
        return 0

    words = text.lower().split()
    cleaned_words = [word.strip(".,!?;:\"'") for word in words]

    # Count emotion keyword matches
    fear_count = sum(1 for word in cleaned_words if word in FEAR_KEYWORDS)
    anger_count = sum(1 for word in cleaned_words if word in ANGER_KEYWORDS)
    desperation_count = sum(1 for word in cleaned_words if word in DESPERATION_KEYWORDS)
    sadness_count = sum(1 for word in cleaned_words if word in SADNESS_KEYWORDS)

    total_emotion_words = fear_count + anger_count + desperation_count + sadness_count

    if total_emotion_words == 0:
        return 0  # No emotions detected

    # Desperation and fear weighted higher as trauma indicators
    emotion_intensity = (
        fear_count * 1.5 +
        desperation_count * 1.5 +
        anger_count * 1.0 +
        sadness_count * 1.0
    )

    # Normalize: assume max ~15 intense keywords = 100 score
    normalized_emotion = (emotion_intensity / 15) * 100

    return max(0, min(100, normalized_emotion))
