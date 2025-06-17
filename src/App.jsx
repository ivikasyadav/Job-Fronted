// client/src/App.jsx
import React, { useState, useEffect } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const renderPage = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (user) {
      if (currentPage === 'dashboard' || currentPage === 'home') { 
        if (user.role === 'job_poster') {
          return <DashboardPoster setCurrentPage={setCurrentPage} />;
        } else if (user.role === 'job_applicant') {
          return <DashboardApplicant setCurrentPage={setCurrentPage} />;
        }
      } else if (currentPage === 'profile') {
        return <ProfilePage />;
      }
    } else {
      if (currentPage === 'login') {
        return <Login setCurrentPage={setCurrentPage} />;
      } else if (currentPage === 'signup') {
        return <Signup setCurrentPage={setCurrentPage} />;
      }
    }
    if (currentPage === 'home') {
      return <HomePage setCurrentPage={setCurrentPage} />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header user={user} logout={logout} setCurrentPage={setCurrentPage} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            message={notification.message}
            type={notification.type}
          />
        ))}
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
