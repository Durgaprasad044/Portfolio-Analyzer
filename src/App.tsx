import React, { useState, useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import WalletInput from './components/WalletInput';
import PortfolioSummary from './components/PortfolioSummary';
import TokenTable from './components/TokenTable';
import ThemeToggle from './components/ThemeToggle';
import PerformanceTracker from './components/PerformanceTracker';
import RiskAlerts from './components/RiskAlerts';
import SocialShare from './components/SocialShare';
import MultiWalletComparison from './components/MultiWalletComparison';
import { fetchWalletTokens } from './api/jupiterApi';
import { fetchMultipleTokenShieldData } from './api/shieldApi';
import { analyzeToken, analyzePortfolio } from './utils/portfolioAnalyzer';
import { WalletAnalysis, SocialShareData } from './types/portfolio';

function App() {
  const [walletAnalyses, setWalletAnalyses] = useState<WalletAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<WalletAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }}
      />
      
      <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
      
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
                className="text-4xl font-bold text-white mb-4"
              >
                Portfolio Analysis Complete
              </motion.h1>
              <p className="text-white/70 mb-4">
                Wallet: <code className="bg-white/10 px-2 py-1 rounded text-purple-300">
                  {currentAnalysis.address.slice(0, 8)}...{currentAnalysis.address.slice(-8)}
                </code>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentAnalysis(null)}
                  className="text-purple-400 hover:text-purple-300 transition-colors underline"
                >
                  Analyze Another Wallet
                </button>
                {walletAnalyses.length > 1 && (
                  <button
                    onClick={() => setShowMultiWallet(!showMultiWallet)}
                    className="text-blue-400 hover:text-blue-300 transition-colors underline"
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
              className="text-center py-8 text-white/50"
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

export default App;