"""
Sentiment Scorer - Lexicon-based sentiment analysis

Counts positive and negative keywords to generate a sentiment score.
Structured to swap in a real transformer model (e.g., DistilBERT, RoBERTa) later.
"""

# Simple keyword lexicons for demo
POSITIVE_WORDS = {
    "good", "better", "best", "great", "wonderful", "happy", "glad", "love",
    "excellent", "amazing", "fantastic", "well", "fine", "okay", "ok",
    "support", "help", "care", "safe", "security", "strong", "courage",
}

NEGATIVE_WORDS = {
    "bad", "worse", "worst", "terrible", "awful", "horrible", "hate",
    "sad", "depressed", "anxious", "afraid", "fear", "worry", "concern",
    "lonely", "alone", "abandoned", "lost", "helpless", "hopeless",
    "pain", "hurt", "suffer", "break", "broken", "tired", "exhausted",
    "abuse", "violence", "death", "die", "suicide", "kill",
}


def score_sentiment(text: str) -> float:
    """
    Score sentiment from text (0-100 scale).
    0 = very negative, 50 = neutral, 100 = very positive.

    Args:
        text (str): Input text to analyze

    Returns:
        float: Sentiment score 0-100
    """
    if not text or len(text.strip()) == 0:
        return 50  # Neutral if empty

    words = text.lower().split()
    positive_count = sum(1 for word in words if word.strip(".,!?;:") in POSITIVE_WORDS)
    negative_count = sum(1 for word in words if word.strip(".,!?;:") in NEGATIVE_WORDS)
    total_sentiment_words = positive_count + negative_count

    if total_sentiment_words == 0:
        return 50  # Neutral if no sentiment words

    # Score: -1 to +1, then normalize to 0-100
    raw_sentiment = (positive_count - negative_count) / total_sentiment_words
    normalized_sentiment = (raw_sentiment + 1) / 2 * 100

    return max(0, min(100, normalized_sentiment))
