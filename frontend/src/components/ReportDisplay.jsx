import { useState } from 'react';

/**
 * ReportDisplay Component
 * Displays the Gemini-generated AI report with SVI score, breakdown, and recommendations
 */
export function ReportDisplay({ result }) {
  const [expandedSection, setExpandedSection] = useState('overview');

  if (!result) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No report data available</p>
      </div>
    );
  }

  const getScoreColor = (score, maxScore = 100) => {
    const percent = (score / maxScore) * 100;
    if (percent <= 25) return 'text-green-600';
    if (percent <= 50) return 'text-yellow-600';
    if (percent <= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryBg = (category) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Moderate: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const ProgressBar = ({ label, score, max = 100 }) => {
    const percent = (score / max) * 100;
    const color = percent <= 25 ? 'bg-green-500' :
                  percent <= 50 ? 'bg-yellow-500' :
                  percent <= 75 ? 'bg-orange-500' : 'bg-red-500';

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-semibold ${getScoreColor(score, max)}`}>
            {score.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${color} transition-all duration-300`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SVI Score Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Stress Vulnerability Index (SVI)
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-bold text-gray-900">
                {result.svi_score?.toFixed(1) || '0'}
              </span>
              <span className="text-2xl text-gray-500">/100</span>
            </div>
          </div>
          <div className={`inline-block px-6 py-3 rounded-full font-bold text-lg ${getCategoryBg(result.category)}`}>
            {result.category?.toUpperCase()}
          </div>
        </div>

        {/* Category Description */}
        <div className="text-sm mt-4 pt-4 border-t border-gray-200 text-gray-600">
          {result.category === 'Critical' && '⚠️ Flagged for immediate human review'}
          {result.category === 'High' && '⚠️ Requires urgent counsellor consultation'}
          {result.category === 'Moderate' && '📋 Counsellor callback can be arranged'}
          {result.category === 'Low' && '✓ Self-help resources available'}
        </div>
      </div>

      {/* Recommended Action */}
      {result.recommended_action && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="text-sm font-bold text-blue-900 uppercase mb-2">Recommended Action</h3>
          <p className="text-lg text-blue-900 font-medium">
            {result.recommended_action}
          </p>
        </div>
      )}

      {/* Analysis Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factor Progress Bars */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> Assessment Factors
          </h3>

          {result.analysis_breakdown ? (
            <div className="space-y-6">
              <ProgressBar
                label="Emotional Intensity"
                score={result.analysis_breakdown.emotional_intensity || 0}
              />
              <ProgressBar
                label="Sentiment Analysis"
                score={Math.max(0, (result.analysis_breakdown.sentiment || 0) + 100) / 2}
              />
              <ProgressBar
                label="Crisis Indicators"
                score={result.analysis_breakdown.crisis_indicators || 0}
              />
              <ProgressBar
                label="Narrative Severity"
                score={result.analysis_breakdown.narrative_severity || 0}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No breakdown data available</p>
          )}
        </div>

        {/* Factor Cards */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📈</span> Breakdown Summary
          </h3>

          {result.analysis_breakdown ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Emotional</p>
                <p className="text-3xl font-bold text-purple-900">
                  {result.analysis_breakdown.emotional_intensity?.toFixed(0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Sentiment</p>
                <p className="text-3xl font-bold text-blue-900">
                  {result.analysis_breakdown.sentiment?.toFixed(0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-orange-700 uppercase mb-1">Crisis</p>
                <p className="text-3xl font-bold text-orange-900">
                  {result.analysis_breakdown.crisis_indicators?.toFixed(0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-red-700 uppercase mb-1">Severity</p>
                <p className="text-3xl font-bold text-red-900">
                  {result.analysis_breakdown.narrative_severity?.toFixed(0)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No summary data available</p>
          )}
        </div>
      </div>

      {/* AI Generated Report */}
      {result.ai_report && (
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span> AI Analysis Report
          </h3>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap font-medium">
              {result.ai_report}
            </p>
          </div>
          <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
            Generated by Google Gemini AI • Not a clinical diagnosis • For counsellor review only
          </div>
        </div>
      )}

      {/* Collapsible Full Data */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xl">📋</span> Full Assessment Data
          </h3>
          <span className={`text-gray-600 transition-transform ${expandedSection === 'details' ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSection === 'details' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-auto text-xs max-h-64 font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportDisplay;
