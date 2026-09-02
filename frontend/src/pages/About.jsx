import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            // about sahai
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            Built to help the first responder<br />
            <span className="text-blue-600">see who needs help most.</span>
          </h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              Every year, hundreds of thousands of victims and complainants reach out to the
              National Helpline Against Atrocities (14566) and the Integrated Portal — often in
              moments of severe emotional distress arising from caste-based discrimination,
              violence, or prolonged legal struggle. Right now, there's no standardized way to
              gauge how urgently a caller needs human support at the moment of first contact.
            </p>

            <p>
              SahAI is a prototype triage assistant built for the Smart India Hackathon. It
              analyzes what a victim types or says, generates a Stress Vulnerability Index (SVI),
              and flags cases by risk level — so counsellors and officials can prioritize the
              people who need immediate attention, instead of treating every case identically.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What SahAI actually is</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A decision-support prototype — not a diagnostic or legal tool</li>
              <li>A demonstration of how AI-assisted triage could work for helplines at scale</li>
              <li>Designed with human review built into every high-risk decision, by default</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What SahAI is not</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Not clinically validated — the SVI score is not a medical or psychiatric assessment</li>
              <li>Not affiliated with or endorsed by NHAA, the Ministry of Social Justice and
                Empowerment, or any government body</li>
              <li>Not connected to real NHAA infrastructure, IVRS, or case management systems</li>
              <li>Never auto-escalates to police, emergency services, or any external party — every
                Critical case is flagged for a human to review and act on</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why we built it this way</h2>
            <p>
              Trauma triage carries real stakes. A system that scores confidently but incorrectly
              can do more harm than one that's honest about its limits. That's why SahAI keeps a
              human in the loop for every high-risk case, explains its reasoning instead of hiding
              behind a black-box score, and treats privacy — no stored audio, minimal retained
              data — as a design requirement, not an afterthought.
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <button onClick={() => navigate('/intake')} className="btn-primary px-6 py-3">
              Try the Assessment →
            </button>
            <button onClick={() => navigate('/how-it-works')} className="btn-secondary px-6 py-3">
              See How It Works →
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
