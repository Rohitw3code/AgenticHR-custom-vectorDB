import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminCreds = {
      username: 'admin',
      password: 'admin123'
    };

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === adminCreds.username && password === adminCreds.password) {
      login({ username, password });
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-cyber-900 dark:via-cyber-800 dark:to-cyber-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-cyber-700 dark:to-cyber-600 p-3 rounded-full">
              <Shield className="h-12 w-12 text-white dark:text-neon-blue" />
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Access the administrative dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-neon-blue/20 dark:to-neon-purple/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
          <div className="relative bg-gray-50/80 dark:bg-cyber-700/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-200/50 dark:border-cyber-600/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    defaultValue="admin"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-cyber-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-50/50 dark:bg-cyber-800/50 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-blue focus:border-transparent transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue="admin123"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-cyber-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-50/50 dark:bg-cyber-800/50 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-blue focus:border-transparent transition-colors duration-300"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50/50 dark:bg-red-900/30 backdrop-blur-xl border-l-4 border-red-400 dark:border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Lock className="h-5 w-5 text-red-400 dark:text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-neon-blue/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-neon-blue transition-all duration-300"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;