import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Menu, X, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  const { currentUser, userProfile, login, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAuthAction = () => {
    if (currentUser) {
      logout();
    } else {
      login();
    }
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  return (
<header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 shadow-sm ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-700 text-white shadow-gray-800' 
        : 'bg-white/95 border-gray-200 text-gray-900 shadow-gray-300'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-primary-700' : 'bg-primary-500'
            }`}>
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Portfolio Analyzer</h1>
              <p className="text-xs opacity-70">Solana Wallet Analysis</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
<div className="hidden md:flex items-center space-x-4">
            <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
            
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors shadow-sm ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-white shadow-gray-700' 
                      : 'hover:bg-gray-100 text-gray-700 shadow-gray-300'
                  }`}
                >
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full shadow-md"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium">
                    {userProfile?.displayName || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-sm">{userProfile?.displayName}</p>
                        <p className="text-xs opacity-70">{userProfile?.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleAuthAction}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-gray-700 text-red-400' 
                              : 'hover:bg-gray-100 text-red-600'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-primary-700 hover:bg-primary-800 text-white shadow-primary-700'
                    : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-300'
                }`}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
<div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-2 rounded-lg transition-colors shadow-sm ${
                isDarkMode ? 'hover:bg-gray-700 shadow-gray-700' : 'hover:bg-gray-100 shadow-gray-300'
              }`}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
<div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
                </div>
                
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {userProfile?.photoURL ? (
                        <img 
                          src={userProfile.photoURL} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full shadow-md"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                        }`}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{userProfile?.displayName}</p>
                        <p className="text-xs opacity-70">{userProfile?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowMobileMenu(false)}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors shadow-sm ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-gray-300 shadow-gray-700' 
                            : 'hover:bg-gray-100 text-gray-700 shadow-gray-300'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleAuthAction}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors shadow-sm ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-red-400 shadow-red-700' 
                            : 'hover:bg-gray-100 text-red-600 shadow-red-300'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthAction}
                    className={`w-full mx-3 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-300'
                    }`}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;