import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-cyber-900 dark:via-cyber-800 dark:to-cyber-900 transition-colors duration-300">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App