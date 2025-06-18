// client/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Notification from './components/Common/Notification';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import HomePage from './pages/HomePage';
import DashboardPoster from './pages/DashboardPoster';
import DashboardApplicant from './pages/DashboardApplicant';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import LoadingSpinner from './components/Common/LoadingSpinner';

function App() {
  const { user, loading, logout, checkAuthStatus } = useAuth();
  const { notifications } = useNotifications();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-inter">
        <Header user={user} logout={logout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {notifications.map((notification, index) => (
            <Notification
              key={index}
              message={notification.message}
              type={notification.type}
            />
          ))}

          <Routes>
            <Route path="/" element={<HomePage />} />

            {!user && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </>
            )}

            {user && user.role === 'job_poster' && (
              <Route path="/dashboard" element={<DashboardPoster />} />
            )}

            {user && user.role === 'job_applicant' && (
              <Route path="/dashboard" element={<DashboardApplicant />} />
            )}

            {user && <Route path="/profile" element={<ProfilePage />} />}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
