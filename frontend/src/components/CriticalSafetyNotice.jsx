import React from 'react';

export default function CriticalSafetyNotice({ caseId, onOpenChat }) {
  return (
    <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-6 mb-8 shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
          🚨
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xl font-bold text-red-900">
              Immediate Support Requested — You Are Connected to a Mental Health Professional
            </h3>
            <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-semibold uppercase tracking-wide">
              Queue Status: Active
            </span>
          </div>

          <p className="text-red-800 mt-2 text-sm leading-relaxed">
            Your assessment indicates high distress levels. You have been automatically flagged for immediate priority review by an on-call mental health professional.
          </p>

          {/* Crisis Helplines */}
          <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200">
            <p className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2">
              📞 24/7 Immediate Crisis Helplines
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-2 bg-red-100/50 rounded-lg text-red-900 font-semibold border border-red-200 flex items-center gap-2">
                <span>💬</span> iCall: <a href="tel:9152987821" className="underline hover:text-red-700">9152987821</a>
              </div>
              <div className="p-2 bg-red-100/50 rounded-lg text-red-900 font-semibold border border-red-200 flex items-center gap-2">
                <span>🛡️</span> KIRAN: <a href="tel:18005990019" className="underline hover:text-red-700">1800-599-0019</a>
              </div>
              <div className="p-2 bg-red-100/50 rounded-lg text-red-900 font-semibold border border-red-200 flex items-center gap-2">
                <span>🤝</span> Vandrevala: <a href="tel:9999666555" className="underline hover:text-red-700">9999 666 555</a>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onOpenChat}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <span>💬</span> Start Live Chat with Psychiatrist
            </button>
            <span className="text-xs text-red-700">
              Case ID: <span className="font-mono font-bold">{caseId}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
