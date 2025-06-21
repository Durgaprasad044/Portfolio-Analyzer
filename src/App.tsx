import React, { useState, useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import WalletInput from './components/WalletInput';
import PortfolioSummary from './components/PortfolioSummary';
import TokenTable from './components/TokenTable';
import PerformanceTracker from './components/PerformanceTracker';
import RiskAlerts from './components/RiskAlerts';
import SocialShare from './components/SocialShare';
import MultiWalletComparison from './components/MultiWalletComparison';
import { fetchWalletTokens } from './api/jupiterApi';
import { fetchMultipleTokenShieldData } from './api/shieldApi';
import { analyzeToken, analyzePortfolio } from './utils/portfolioAnalyzer';
import { WalletAnalysis, SocialShareData } from './types/portfolio';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [walletAnalyses, setWalletAnalyses] = useState<WalletAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<WalletAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showMultiWallet, setShowMultiWallet] = useState(false);

  const analyzeWallet = useCallback(async (walletAddress: string) => {
    // Check if we already have this wallet analyzed
    const existingAnalysis = walletAnalyses.find(analysis => analysis.address === walletAddress);
    if (existingAnalysis) {
      setCurrentAnalysis(existingAnalysis);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Fetch token balances
      const tokenBalances = await fetchWalletTokens(walletAddress);
      
      if (tokenBalances.length === 0) {
        setError('No tokens found in this wallet or wallet address is invalid.');
        return;
      }

      // Fetch shield data for all tokens
      const tokenMints = tokenBalances.map(token => token.mint);
      const shieldDataArray = await fetchMultipleTokenShieldData(tokenMints);

      // Analyze each token
      const analyzedTokens = await Promise.all(
        tokenBalances.map((token, index) => 
          analyzeToken(token, shieldDataArray[index])
        )
      );

      // Analyze overall portfolio
      const portfolioAnalysis = analyzePortfolio(analyzedTokens);

      // Collect all alerts from tokens
      const allAlerts = analyzedTokens.flatMap(token => token.alerts || []);

      const analysis: WalletAnalysis = {
        address: walletAddress,
        tokens: analyzedTokens,
        analysis: portfolioAnalysis,
        lastUpdated: new Date(),
        alerts: allAlerts,
        badges: [portfolioAnalysis.badge]
      };

      setCurrentAnalysis(analysis);
      setWalletAnalyses(prev => [...prev, analysis]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [walletAnalyses]);

  const handleDismissAlert = useCallback((alertId: string) => {
    if (!currentAnalysis) return;

    const updatedAnalysis = {
      ...currentAnalysis,
      alerts: currentAnalysis.alerts.filter(alert => alert.id !== alertId)
    };

    setCurrentAnalysis(updatedAnalysis);
    setWalletAnalyses(prev => 
      prev.map(analysis => 
        analysis.address === currentAnalysis.address ? updatedAnalysis : analysis
      )
    );
  }, [currentAnalysis]);

  const handleAddWallet = () => {
    setCurrentAnalysis(null);
    setShowMultiWallet(false);
  };

  const handleRemoveWallet = (address: string) => {
    setWalletAnalyses(prev => prev.filter(analysis => analysis.address !== address));
    if (currentAnalysis?.address === address) {
      setCurrentAnalysis(null);
    }
  };

  const generateSocialShareData = (): SocialShareData | null => {
    if (!currentAnalysis) return null;

    return {
      badge: currentAnalysis.analysis.badge,
      riskScore: currentAnalysis.analysis.riskScore,
      totalTokens: currentAnalysis.analysis.totalTokens,
      shareUrl: `${window.location.origin}?wallet=${currentAnalysis.address}`,
      imageUrl: '' // Would be generated dynamically
    };
  };

  // Auto-analyze wallet from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const walletParam = urlParams.get('wallet');
    if (walletParam && walletAnalyses.length === 0) {
      analyzeWallet(walletParam);
    }
  }, [analyzeWallet, walletAnalyses.length]);

  const socialShareData = generateSocialShareData();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white shadow-inner shadow-black/50' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            color: isDarkMode ? 'white' : '#1f2937',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
          }
        }}
      />
      
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      
      <div className="container mx-auto px-4 py-12">
        {!currentAnalysis ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[80vh]"
          >
            <WalletInput 
              onAnalyze={analyzeWallet}
              loading={loading}
              error={error}
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header with wallet info */}
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-4xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Portfolio Analysis Complete
              </motion.h1>
              <p className={`mb-4 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                Wallet: <code className={`px-2 py-1 rounded ${
                  isDarkMode 
                    ? 'bg-white/10 text-purple-300' 
                    : 'bg-gray-200 text-purple-600'
                }`}>
                  {currentAnalysis.address.slice(0, 8)}...{currentAnalysis.address.slice(-8)}
                </code>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentAnalysis(null)}
                  className={`transition-colors underline ${
                    isDarkMode 
                      ? 'text-purple-400 hover:text-purple-300' 
                      : 'text-purple-600 hover:text-purple-500'
                  }`}
                >
                  Analyze Another Wallet
                </button>
                {walletAnalyses.length > 1 && (
                  <button
                    onClick={() => setShowMultiWallet(!showMultiWallet)}
                    className={`transition-colors underline ${
                      isDarkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    {showMultiWallet ? 'Hide' : 'Show'} Multi-Wallet Comparison
                  </button>
                )}
              </div>
            </div>

            <PortfolioSummary analysis={currentAnalysis} />
            
            {/* Performance and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceTracker 
                walletAddress={currentAnalysis.address}
                currentValue={currentAnalysis.analysis.totalValue}
              />
              <RiskAlerts 
                alerts={currentAnalysis.alerts}
                onDismissAlert={handleDismissAlert}
              />
            </div>

            {/* Multi-Wallet Comparison */}
            {showMultiWallet && (
              <MultiWalletComparison
                analyses={walletAnalyses}
                onAddWallet={handleAddWallet}
                onRemoveWallet={handleRemoveWallet}
              />
            )}

            <TokenTable tokens={currentAnalysis.tokens} />
            
            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className={`text-center py-8 ${
                isDarkMode ? 'text-white/50' : 'text-gray-500'
              }`}
            >
              <p className="text-sm">
                Last updated: {currentAnalysis.lastUpdated.toLocaleString()}
              </p>
              <p className="text-xs mt-2">
                Data provided by Jupiter Aggregator and Shield API
              </p>
              <p className="text-xs mt-1">
                Enhanced with AI classification and advanced risk scoring
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Social Share Component */}
      {socialShareData && <SocialShare shareData={socialShareData} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;