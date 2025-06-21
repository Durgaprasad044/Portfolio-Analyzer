import React, { useState } from 'react';
import { WalletAnalysis } from '../types/portfolio';
import { Plus, X, Users, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiWalletComparisonProps {
  analyses: WalletAnalysis[];
  onAddWallet: () => void;
  onRemoveWallet: (address: string) => void;
}

export default function MultiWalletComparison({ analyses, onAddWallet, onRemoveWallet }: MultiWalletComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (analyses.length <= 1) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
      >
        <div className="text-center">
          <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Multi-Wallet Comparison</h3>
          <p className="text-white/70 mb-4">Add more wallets to compare portfolios side by side</p>
          <button
            onClick={onAddWallet}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>
      </motion.div>
    );
  }

  const getComparisonMetrics = () => {
    return analyses.map(analysis => ({
      address: analysis.address,
      label: analysis.analysis.overallLabel,
      riskScore: analysis.analysis.riskScore,
      totalValue: analysis.analysis.totalValue,
      tokenCount: analysis.analysis.totalTokens,
      diversification: analysis.analysis.diversificationScore
    }));
  };

  const metrics = getComparisonMetrics();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            Multi-Wallet Comparison ({analyses.length} wallets)
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={onAddWallet}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Wallet
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Comparison */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white/70 text-sm">Highest Value</span>
            </div>
            <div className="text-xl font-bold text-white">
              ${Math.max(...metrics.map(m => m.totalValue)).toLocaleString()}
            </div>
            <div className="text-white/50 text-xs">
              {metrics.find(m => m.totalValue === Math.max(...metrics.map(m => m.totalValue)))?.address.slice(0, 8)}...
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-white/70 text-sm">Lowest Risk</span>
            </div>
            <div className="text-xl font-bold text-white">
              {Math.min(...metrics.map(m => m.riskScore))}
            </div>
            <div className="text-white/50 text-xs">
              {metrics.find(m => m.riskScore === Math.min(...metrics.map(m => m.riskScore)))?.address.slice(0, 8)}...
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white/70 text-sm">Most Diversified</span>
            </div>
            <div className="text-xl font-bold text-white">
              {Math.max(...metrics.map(m => m.diversification)).toFixed(0)}%
            </div>
            <div className="text-white/50 text-xs">
              {metrics.find(m => m.diversification === Math.max(...metrics.map(m => m.diversification)))?.address.slice(0, 8)}...
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white font-semibold py-3">Wallet</th>
                      <th className="text-center text-white font-semibold py-3">Label</th>
                      <th className="text-center text-white font-semibold py-3">Risk Score</th>
                      <th className="text-right text-white font-semibold py-3">Value</th>
                      <th className="text-center text-white font-semibold py-3">Tokens</th>
                      <th className="text-center text-white font-semibold py-3">Diversification</th>
                      <th className="text-center text-white font-semibold py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric, index) => (
                      <motion.tr
                        key={metric.address}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4">
                          <div className="font-mono text-white text-sm">
                            {metric.address.slice(0, 8)}...{metric.address.slice(-8)}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            metric.label === 'Investor' ? 'bg-green-500/20 text-green-400' :
                            metric.label === 'Normie' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {metric.label}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <div className={`font-bold ${
                            metric.riskScore < 30 ? 'text-green-400' :
                            metric.riskScore < 70 ? 'text-orange-400' :
                            'text-red-400'
                          }`}>
                            {metric.riskScore}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="text-white font-medium">
                            ${metric.totalValue.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="text-white">{metric.tokenCount}</div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="text-white">{metric.diversification.toFixed(0)}%</div>
                        </td>
                        <td className="py-4 text-center">
                          <button
                            onClick={() => onRemoveWallet(metric.address)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}