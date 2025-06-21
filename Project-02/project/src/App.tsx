import React from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import PortfolioOverview from './components/Dashboard/PortfolioOverview';
import TokenAnalytics from './components/Dashboard/TokenAnalytics';
import SwapInterface from './components/Swap/SwapInterface';
import YieldDashboard from './components/YieldFarming/YieldDashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SolTracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!user ? (
            /* Welcome Screen */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-3xl">S</span>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                  SolTracker
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  The ultimate DeFi tracking platform for Solana. Monitor your portfolio, 
                  analyze tokens, swap assets, and maximize yields - all in one place.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
              >
                {[
                  {
                    icon: '📊',
                    title: 'Portfolio Tracking',
                    description: 'Real-time portfolio monitoring with Jupiter API integration'
                  },
                  {
                    icon: '🔄',
                    title: 'Token Swapping',
                    description: 'Seamless token swaps with best price execution'
                  },
                  {
                    icon: '🌱',
                    title: 'Yield Farming',
                    description: 'Discover and manage yield farming opportunities'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="space-y-4"
              >
                <p className="text-gray-300 text-lg">
                  Sign in to start tracking your Solana DeFi journey
                </p>
              </motion.div>
            </motion.div>
          ) : (
            /* Main Dashboard */
            <div className="space-y-8">
              {/* Portfolio Section */}
              <section>
                <PortfolioOverview />
              </section>

              {/* Analytics Section */}
              <section>
                <TokenAnalytics />
              </section>

              {/* Swap Section */}
              <section className="py-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Token Swap</h2>
                  <p className="text-gray-400">Exchange tokens with the best rates</p>
                </div>
                <SwapInterface />
              </section>

              {/* Yield Farming Section */}
              <section>
                <YieldDashboard />
              </section>
            </div>
          )}
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151'
          }
        }}
      />
    </div>
  );
}

export default App;