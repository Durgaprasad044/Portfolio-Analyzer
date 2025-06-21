import React, { useState } from 'react';
import { Search, Wallet, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import WalletConnect from './WalletConnect';

interface WalletInputProps {
  onAnalyze: (address: string) => void;
  loading: boolean;
  error?: string;
}

export default function WalletInput({ onAnalyze, loading, error }: WalletInputProps) {
  const { isDarkMode } = useTheme();
  const [address, setAddress] = useState('');
  const [inputMethod, setInputMethod] = useState<'manual' | 'connect'>('manual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onAnalyze(address.trim());
    }
  };

  const handleWalletConnected = (publicKey: string) => {
    setAddress(publicKey);
    onAnalyze(publicKey);
  };

  const isValidSolanaAddress = (addr: string) => {
    return addr.length >= 32 && addr.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(addr);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Method Toggle */}
      <div className="flex justify-center">
        <div className={`backdrop-blur-lg rounded-xl p-1 border ${
          isDarkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-gray-100 border-gray-300'
        }`}>
          <button
            onClick={() => setInputMethod('manual')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              inputMethod === 'manual'
                ? isDarkMode 
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white text-gray-900 shadow-lg'
                : isDarkMode
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manual Input
          </button>
          <button
            onClick={() => setInputMethod('connect')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              inputMethod === 'connect'
                ? isDarkMode 
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white text-gray-900 shadow-lg'
                : isDarkMode
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Connect Wallet
          </button>
        </div>
      </div>

      {inputMethod === 'connect' ? (
        <WalletConnect onWalletConnected={handleWalletConnected} />
      ) : (
        <div className={`backdrop-blur-lg rounded-2xl p-8 border shadow-2xl ${
          isDarkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Portfolio Risk Analyzer</h2>
            <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>
              Enter your Solana wallet address to analyze your token portfolio risk
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Solana wallet address..."
                className={`w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/20 text-white placeholder-white/50'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                disabled={loading}
              />
              <Search className={`absolute right-4 top-4 w-6 h-6 ${
                isDarkMode ? 'text-white/50' : 'text-gray-400'
              }`} />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !address.trim() || !isValidSolanaAddress(address)}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Analyzing Portfolio...
                </div>
              ) : (
                'Analyze Portfolio'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
              Don't have a wallet? Try: <br />
              <code className={`text-xs ${
                isDarkMode ? 'text-purple-300' : 'text-purple-600'
              }`}>7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}