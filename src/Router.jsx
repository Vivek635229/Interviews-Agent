import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { useAuth } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ChatLayout from './layouts/ChatLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Interview = lazy(() => import('./pages/Interview'));
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'));
const ResumeAnalysis = lazy(() => import('./pages/ResumeAnalysis'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Page loading fallback */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-hairline border-t-primary animate-spin" />
      <p className="text-body-sm text-mute">Loading...</p>
    </div>
  </div>
);

/** Redirect authenticated users away from auth pages */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
};

/**
 * Router — React Router v6 with lazy loading and layout wrappers.
 */
const Router = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes — Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<GuestRoute><Login /></GuestRoute>} />
          <Route path={ROUTES.REGISTER} element={<GuestRoute><Register /></GuestRoute>} />
        </Route>

        {/* App routes — Sidebar layout (protected) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.RESUME_UPLOAD} element={<ResumeUpload />} />
          <Route path={ROUTES.RESUME_ANALYSIS} element={<ResumeAnalysis />} />
          <Route path={ROUTES.INTERVIEW_HISTORY} element={<InterviewHistory />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>

        {/* Chat route — Full-height split layout (protected) */}
        <Route element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
          <Route path={ROUTES.INTERVIEW} element={<Interview />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default Router;
