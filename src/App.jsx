import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen/SplashScreen';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, isGuest, loading } = useAuth();
  
  if (loading) return null;
  if (!user && !isGuest) return <Navigate to="/" />;
  return children;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}
