import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Logs } from './pages/Logs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/welcome" replace />;
  return children;
};

// Redirect signed-in users away from auth / landing pages
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route path="/welcome" element={
            <AuthRoute><Landing /></AuthRoute>
          } />

          {/* Auth routes */}
          <Route path="/login" element={
            <AuthRoute><Login /></AuthRoute>
          } />
          <Route path="/signup" element={
            <AuthRoute><SignUp /></AuthRoute>
          } />

          {/* Protected app routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="logs" element={<Logs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Root redirect: unauthenticated → /welcome, authenticated → / (handled by ProtectedRoute) */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
