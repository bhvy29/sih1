import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  const copyHelpline = async () => {
    try {
      await navigator.clipboard.writeText("14566");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail (e.g. insecure context) — number is still
      // visible on the badge itself, so this is a silent no-op fallback.
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SahAI</span>
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={copyHelpline}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-semibold hover:bg-red-100"
              title="Click to copy number"
            >
              <span aria-hidden="true">📞</span>
              {copied ? "Copied!" : "NHAA 14566"}
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-gray-600 hover:text-gray-900"
            >
              About
            </button>
            <button
              onClick={() => navigate("/how-it-works")}
              className="text-gray-600 hover:text-gray-900"
            >
              How It Works
            </button>
            <button
              onClick={() => navigate("/resources")}
              className="text-gray-600 hover:text-gray-900"
            >
              Resources
            </button>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
            >
              {i18n.language === "en" ? "हिन्दी" : "English"}
            </button>
            <button
              onClick={() => navigate("/psychiatrist/login")}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Psychiatrist Portal
            </button>
            <button
              onClick={() => navigate("/consent")}
              className="btn-primary"
            >
              {t("landing.cta_primary")}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500 font-mono mb-4">
              {t("landing.eyebrow")}
            </p>
            <h1 className="text-6xl font-bold leading-tight mb-6">
              {t("landing.headline_part1")}{" "}
              <span className="text-blue-600">
                {t("landing.headline_part2")}
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              {t("landing.description")}
            </p>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => navigate("/consent")}
                className="btn-primary flex items-center gap-2"
              >
                {t("landing.cta_primary")} <span>→</span>
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-secondary flex items-center gap-2"
              >
                {t("landing.cta_secondary")} <span>→</span>
              </button>
            </div>
            <p className="text-sm text-gray-600">{t("landing.social_proof")}</p>
          </div>

          {/* Right: Mock UI Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-2">Live Assessment</p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  "I am very scared and don't know where to go. This happened
                  last week and I haven't slept since..."
                </p>
              </div>

              {/* SVI Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-700">
                    Stress Vulnerability Index
                  </span>
                  <span className="text-lg font-bold text-red-600">72</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-yellow-400 to-red-500"></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span className="text-red-600 font-semibold">Critical</span>
                </div>
              </div>

              {/* Risk Badge */}
              <div className="bg-red-100 border border-red-300 rounded p-3">
                <p className="text-xs font-semibold text-red-800">
                  🚨 Flagged for Human Review
                </p>
              </div>
            </div>

            {/* Sticky Note */}
            <div className="absolute -top-8 -right-8 bg-yellow-200 rounded-lg p-4 shadow-md transform rotate-3 w-48 border-2 border-yellow-300">
              <div className="absolute -top-2 left-4 w-4 h-4 bg-red-500 rounded-full border border-red-600"></div>
              <p className="text-sm font-handwriting text-gray-800">
                {t("landing.sticky_note")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>{t("footer.disclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
