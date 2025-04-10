import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserLogin: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const userTypes = ['user1', 'user2', 'user3', 'user4', 'user5'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && selectedType) {
      login({
        id: Math.random(),
        username,
        type: selectedType as 'user1' | 'user2' | 'user3' | 'user4' | 'user5'
      });
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <Users className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your job applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`${
                      selectedType === type
                        ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    } px-4 py-3 border rounded-lg text-sm font-medium focus:outline-none transition-all duration-200 relative group`}
                  >
                    <span className="flex items-center justify-center">
                      {type}
                      {selectedType === type && (
                        <ChevronRight className="h-4 w-4 ml-2 animate-bounce" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!username || !selectedType}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200
                  ${!username || !selectedType
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to the platform?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;