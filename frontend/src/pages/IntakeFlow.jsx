import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiService } from "../services/api";
import useSpeechToText from "../hooks/useSpeechToText";

export default function IntakeFlow() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    transcript: voiceTranscript,
    listening,
    supported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  // Sync live voice transcript into the text field as the user speaks
  useEffect(() => {
    if (voiceTranscript) {
      setText(voiceTranscript);
    }
  }, [voiceTranscript]);

  const handleVoiceButtonClick = () => {
    if (listening) {
      stopListening();
    } else {
      resetTranscript();
      // Use the currently selected app language for recognition
      const speechLang = i18n.language === "hi" ? "hi-IN" : "en-IN";
      startListening(speechLang);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text.trim().length < 20) {
      setError(t("intake.error_too_short"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await apiService.submitAssessment(text, i18n.language);
      // Navigate to results page with case data
      navigate(`/results/${result.case_id}`, { state: { result } });
    } catch (err) {
      setError(t("common.error"));
      console.error("Assessment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SahAI</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/psychiatrist/login")}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Psychiatrist Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("intake.title")}
          </h1>
          <p className="text-lg text-gray-600 mb-8">{t("intake.subtitle")}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Your Story
                </label>
                {listening && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Listening...
                  </span>
                )}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("intake.text_placeholder")}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-600 mt-2">
                {t("intake.char_count", { count: text.length })}
              </p>
              {!speechSupported && (
                <p className="text-xs text-gray-400 mt-1">
                  Voice input isn't supported in this browser — try Chrome or
                  Edge.
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("common.loading") : t("intake.submit")}
              </button>
              <button
                type="button"
                onClick={handleVoiceButtonClick}
                disabled={!speechSupported}
                className={`btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                  listening ? "bg-red-50 border-red-300 text-red-700" : ""
                }`}
              >
                {listening ? '⏹ Stop recording' : `🎤 ${t('intake.record_voice')}`}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Minimum 20 characters required for assessment
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>{t("footer.disclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
