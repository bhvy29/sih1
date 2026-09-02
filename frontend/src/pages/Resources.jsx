import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Resources() {
  const navigate = useNavigate();

  const resources = [
    {
      name: 'National Helpline Against Atrocities (NHAA)',
      number: '14566',
      description:
        'For registering complaints and seeking legal guidance under the SC/ST (Prevention of Atrocities) Act. Available 24/7 in Hindi, English, and regional languages.',
      tag: 'Legal & grievance redressal',
    },
    {
      name: 'Tele MANAS',
      number: '14416 or 1-800-891-4416',
      description:
        'National tele-mental health program run by the Ministry of Health and Family Welfare, offering free counselling and psychological first aid. Operates 24/7 across states in multiple languages. This number has absorbed the earlier KIRAN helpline.',
      tag: 'Mental health support',
    },
    {
      name: 'iCall (TISS)',
      number: '022-25521111',
      description:
        'Free, confidential psychosocial support by trained counsellors, via phone, email, or chat. Run by the Tata Institute of Social Sciences.',
      tag: 'Counselling',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SahAI</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
              Home
            </button>
            <button onClick={() => navigate('/psychiatrist/login')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Psychiatrist Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
            // resources
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Real help,<br />
            <span className="text-blue-600">beyond this prototype.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl">
            SahAI is a hackathon prototype and cannot provide direct support. If you or someone
            you know needs help right now, these are real, active support services in India.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
            <p className="text-sm text-amber-900 leading-relaxed">
              <span className="font-semibold">If this is an emergency</span> — immediate danger to
              life — please call <span className="font-semibold">112</span> (India's national
              emergency number) or go to your nearest hospital or police station directly.
            </p>
          </div>

          <div className="space-y-5">
            {resources.map((r) => (
              <div key={r.name} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {r.tag}
                  </span>
                </div>
                <p className="text-blue-600 font-mono font-semibold mb-2">{r.number}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-8 leading-relaxed">
            Helpline details are provided in good faith and were last checked at the time of
            writing. Numbers and services can change — if a number doesn't connect, please search
            for the current official listing or ask a trusted local authority.
          </p>

          <div className="mt-10">
            <button onClick={() => navigate('/intake')} className="btn-primary px-6 py-3">
              Start Assessment →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>
            Student prototype for Smart India Hackathon. Not affiliated with or a substitute for
            official NHAA 14566 services.
          </p>
        </div>
      </footer>
    </div>
  );
}
