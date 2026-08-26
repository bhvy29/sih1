import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import i18n from './i18n';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ConsentScreen = lazy(() => import('./pages/ConsentScreen'));
const IntakeFlow = lazy(() => import('./pages/IntakeFlow'));
const AssessmentResults = lazy(() => import('./pages/AssessmentResults'));
const CounsellorDashboard = lazy(() => import('./pages/CounsellorDashboard'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/consent" element={<ConsentScreen />} />
          <Route path="/intake" element={<IntakeFlow />} />
          <Route path="/results/:caseId" element={<AssessmentResults />} />
          <Route path="/dashboard" element={<CounsellorDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
