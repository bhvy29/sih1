import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

export default function CounsellorDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [criticalCount, setCriticalCount] = useState(0);
  const [reviewingCaseId, setReviewingCaseId] = useState(null);
  const [counsellorName, setCounsellorName] = useState('');
  const [expandedCaseId, setExpandedCaseId] = useState(null);

  useEffect(() => {
    fetchCases();
    fetchCriticalCount();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchCases(50, 0);
      setCases(data.cases);
    } catch (err) {
      setError('Failed to load cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCriticalCount = async () => {
    try {
      const data = await apiService.getCriticalCount();
      setCriticalCount(data.critical_count);
    } catch (err) {
      console.error('Failed to fetch critical count:', err);
    }
  };

  const handleMarkReviewed = async (caseId) => {
    if (!counsellorName.trim()) {
      alert('Please enter your name to mark this case as reviewed');
      return;
    }

    try {
      await apiService.markCaseReviewed(caseId, counsellorName);
      // Update local state
      setCases(
        cases.map((c) =>
          c.case_id === caseId
            ? { ...c, reviewed_by: counsellorName, reviewed_at: new Date().toISOString() }
            : c
        )
      );
      setReviewingCaseId(null);
      fetchCriticalCount();
    } catch (err) {
      alert('Failed to mark case as reviewed');
      console.error(err);
    }
  };

  const getCategoryBgColor = (category) => {
    const colors = {
      Low: 'bg-green-50',
      Moderate: 'bg-yellow-50',
      High: 'bg-orange-50',
      Critical: 'bg-red-50',
    };
    return colors[category] || 'bg-gray-50';
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

  const toggleExpand = (caseId) => {
    setExpandedCaseId(expandedCaseId === caseId ? null : caseId);
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
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/psychiatrist/login')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Psychiatrist Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {t('dashboard.title')}
          </h1>

          {/* Critical Alert Badge */}
          {criticalCount > 0 && (
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-8 flex items-center gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-semibold text-red-900">
                  {t('dashboard.critical_alert')}
                </p>
                <p className="text-red-800">{criticalCount} critical case(s) requiring immediate review</p>
              </div>
            </div>
          )}

          {/* Counsellor Name Input */}
          <div className="mb-8 flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('dashboard.reviewed_by')}
              </label>
              <input
                type="text"
                value={counsellorName}
                onChange={(e) => setCounsellorName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchCases}
              className="btn-secondary px-6 py-2"
            >
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          )}

          {/* Cases Table */}
          {!loading && cases.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">{t('dashboard.no_cases')}</p>
            </div>
          )}

          {!loading && cases.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.case_id')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.timestamp')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.language')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.svi_score')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.category')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.excerpt')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      {t('dashboard.status')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem, idx) => (
                    <React.Fragment key={caseItem.case_id}>
                      <tr
                        className={`border-b border-gray-200 cursor-pointer ${
                          caseItem.category === 'Critical' ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                        onClick={() => toggleExpand(caseItem.case_id)}
                      >
                        <td className="py-3 px-4 font-mono text-sm">{caseItem.case_id}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(caseItem.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">{caseItem.language.toUpperCase()}</td>
                        <td className="py-3 px-4 font-bold text-lg">{caseItem.svi_score}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(caseItem.category)}`}>
                            {caseItem.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm max-w-xs truncate text-gray-700">
                          {caseItem.transcript_excerpt}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {caseItem.reviewed_by ? (
                            <span className="text-green-700 font-semibold">✓ Reviewed</span>
                          ) : (
                            <span className="text-gray-500">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          {!caseItem.reviewed_by && (
                            <button
                              onClick={() => setReviewingCaseId(caseItem.case_id)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                            >
                              Mark Reviewed
                            </button>
                          )}
                          {reviewingCaseId === caseItem.case_id && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarkReviewed(caseItem.case_id)}
                                className="text-green-600 hover:text-green-800 font-semibold text-sm"
                              >
                                ✓ Confirm
                              </button>
                              <button
                                onClick={() => setReviewingCaseId(null)}
                                className="text-gray-600 hover:text-gray-800 font-semibold text-sm"
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded row: AI-generated case summary (Gemini) */}
                      {expandedCaseId === caseItem.case_id && (
                        <tr className="bg-blue-50/40 border-b border-gray-200">
                          <td colSpan={8} className="py-4 px-4">
                            <p className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wide">
                              AI-generated case summary
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                              {caseItem.ai_report || 'No AI summary available for this case.'}
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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