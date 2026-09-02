import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ConsentScreen() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [agreed, setAgreed] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const handleProceed = () => {
    if (agreed) {
      // Store consent flag in sessionStorage
      sessionStorage.setItem('consent_given', 'true');
      navigate('/intake');
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
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
              Home
            </button>
            <button
              onClick={() => navigate('/psychiatrist/login')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Psychiatrist Portal
            </button>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
            >
              {i18n.language === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t('consent.title')}
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            {t('consent.description')}
          </p>

          {/* Privacy Points */}
          <div className="space-y-4 mb-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-gray-700">{t('consent.privacy_point1')}</p>
            <p className="text-gray-700">{t('consent.privacy_point2')}</p>
            <p className="text-gray-700">{t('consent.privacy_point3')}</p>
            <p className="text-gray-700">{t('consent.privacy_point4')}</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Important:</strong> {t('consent.disclaimer')}
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 mb-8">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer mt-1"
            />
            <label htmlFor="agree" className="text-gray-700 cursor-pointer">
              {t('consent.agree')}
            </label>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('consent.language_label')}
            </label>
            <div className="flex gap-2">
              {['en', 'hi'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    i18n.language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'हिन्दी'}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleProceed}
              disabled={!agreed}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition ${
                agreed
                  ? 'btn-primary'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('consent.proceed')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}
