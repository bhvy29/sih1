import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import i18n from './i18n';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ConsentScreen = lazy(() => import('./pages/ConsentScreen'));
const IntakeFlow = lazy(() => import('./pages/IntakeFlow'));
const AssessmentResults = lazy(() => import('./pages/AssessmentResults'));
const CounsellorDashboard = lazy(() => import('./pages/CounsellorDashboard'));
const About = lazy(() => import('./pages/About'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Resources = lazy(() => import('./pages/Resources'));

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
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;