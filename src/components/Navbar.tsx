import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogIn, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-gray-100/80 dark:bg-cyber-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-cyber-700/50 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
                <Brain className="h-8 w-8 relative text-blue-600 dark:text-neon-blue transition-colors duration-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple bg-clip-text text-transparent">
                AIJobMatch
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200/50 dark:bg-cyber-700/50 hover:bg-gray-300/50 dark:hover:bg-cyber-600/50 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-neon-blue" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600" />
              )}
            </button>
            {!user ? (
              <>
                <Link 
                  to="/user-login" 
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-neon-blue transition-colors duration-300"
                >
                  User Login
                </Link>
                <Link 
                  to="/admin-login" 
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-neon-blue/20 transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;