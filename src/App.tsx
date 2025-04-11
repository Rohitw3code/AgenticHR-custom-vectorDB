import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserCircle, Building2, Sparkles, Cpu } from 'lucide-react';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <nav className="bg-black/50 backdrop-blur-lg border-b border-purple-900/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <Link to="/" className="flex items-center space-x-2">
                <Cpu className="w-8 h-8 text-purple-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text">
                  AgenticHR
                </span>
              </Link>
              <div className="flex space-x-8">
                <Link
                  to="/user"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-purple-400 hover:bg-purple-900/20 transition-all duration-300"
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  User Portal
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-purple-400 hover:bg-purple-900/20 transition-all duration-300"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/user" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;