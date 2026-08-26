import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No assessment data found</p>
          <button
            onClick={() => navigate('/intake')}
            className="btn-primary"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      Low: 'bg-green-50 border-green-200 text-green-800',
      Moderate: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      High: 'bg-orange-50 border-orange-200 text-orange-800',
      Critical: 'bg-red-50 border-red-200 text-red-800',
    };
    return colors[category] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Moderate: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {t('results.title')}
          </h1>

          {/* SVI Score Card */}
          <div className={`border-2 rounded-2xl p-8 mb-8 ${getCategoryColor(result.category)}`}>
            <p className="text-sm font-semibold mb-2">{t('results.svi_label')}</p>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-6xl font-bold">{result.svi_score}</span>
              <span className="text-2xl text-gray-600 mb-2">/100</span>
            </div>

            {/* Category Badge */}
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getCategoryBadgeColor(result.category)}`}>
              {t(`results.category_${result.category.toLowerCase()}`)}
            </div>
          </div>

          {/* Recommended Action */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {t('results.recommended_action')}
            </p>
            <p className="text-lg text-gray-900">
              {result.recommended_action}
            </p>
          </div>

          {/* Contributing Factors */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('results.factors')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {result.analysis_breakdown && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Emotional Intensity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.analysis_breakdown.emotion_score}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Sentiment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.analysis_breakdown.sentiment_score}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Risk Indicators</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.analysis_breakdown.crisis_keyword_risk}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Voice Stress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.analysis_breakdown.voice_stress_score}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Case ID (for reference) */}
          <div className="text-sm text-gray-600 mb-8">
            <p>Case ID: <span className="font-mono text-gray-800">{result.case_id}</span></p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 btn-primary py-3"
            >
              {t('results.back_home')}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary py-3"
            >
              View Dashboard
            </button>
          </div>

          {/* Next Steps Info */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t('results.next_steps')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Your assessment has been securely recorded</li>
              <li>✓ A trained counsellor will review your case within 24 hours</li>
              <li>✓ You will receive follow-up support via your preferred contact method</li>
              <li>✓ All conversations remain confidential and anonymous</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}
