import React from 'react';
import { WalletAnalysis } from '../types/portfolio';
import { TrendingUp, Shield, Award, DollarSign, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioSummaryProps {
  analysis: WalletAnalysis;
}

export default function PortfolioSummary({ analysis }: PortfolioSummaryProps) {
  const { analysis: portfolio } = analysis;


  const getBgColor = (label: string) => {
    switch (label) {
      case 'Investor': return 'from-green-500/20 to-blue-500/20 border-green-500/30';
      case 'Normie': return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30';
      case 'Degen': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Portfolio Label */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`lg:col-span-2 bg-gradient-to-br ${getBgColor(portfolio.overallLabel)} backdrop-blur-lg rounded-2xl p-8 border shadow-2xl`}
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-6xl"
          >
            {portfolio.emoji}
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              You are a {portfolio.overallLabel}!
            </h2>
            <p className="text-white/80 text-lg">{portfolio.description}</p>
            
            {/* Badge Display */}
            <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r ${getBadgeRarityColor(portfolio.badge.rarity)} rounded-full text-white text-sm font-medium`}>
              <Award className="w-4 h-4" />
              {portfolio.badge.emoji} {portfolio.badge.name}
            </div>
          </div>
        </div>
        
        {/* Portfolio Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">
              ${portfolio.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-white/70 text-sm">Total Value</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {portfolio.riskScore}
            </div>
            <div className="text-white/70 text-sm">Risk Score</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(portfolio.diversificationScore)}%
            </div>
            <div className="text-white/70 text-sm">Diversification</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <Shield className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-400">
              {portfolio.totalTokens}
            </div>
            <div className="text-white/70 text-sm">Tokens</div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center p-4 bg-white/5 rounded-xl"
          >
            <div className="text-2xl font-bold text-green-400">
              {portfolio.riskDistribution.low}
            </div>
            <div className="text-white/70 text-sm">Low Risk</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center p-4 bg-white/5 rounded-xl"
          >
            <div className="text-2xl font-bold text-orange-400">
              {portfolio.riskDistribution.medium}
            </div>
            <div className="text-white/70 text-sm">Medium Risk</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center p-4 bg-white/5 rounded-xl"
          >
            <div className="text-2xl font-bold text-red-400">
              {portfolio.riskDistribution.high}
            </div>
            <div className="text-white/70 text-sm">High Risk</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Risk Distribution Chart */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Risk Distribution
        </h3>
        
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            
            {/* Risk segments */}
            {(() => {
              const total = portfolio.totalTokens;
              const lowPercentage = (portfolio.riskDistribution.low / total) * 100;
              const mediumPercentage = (portfolio.riskDistribution.medium / total) * 100;
              const highPercentage = (portfolio.riskDistribution.high / total) * 100;
              
              const circumference = 2 * Math.PI * 40;
              const lowStroke = (lowPercentage / 100) * circumference;
              const mediumStroke = (mediumPercentage / 100) * circumference;
              const highStroke = (highPercentage / 100) * circumference;
              
              const currentOffset = 0;
              
              return (
                <>
                  {/* Low risk */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${lowStroke} ${circumference}`}
                    strokeDashoffset={currentOffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: currentOffset }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  
                  {/* Medium risk */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    strokeDasharray={`${mediumStroke} ${circumference}`}
                    strokeDashoffset={currentOffset - lowStroke}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: currentOffset - lowStroke }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                  
                  {/* High risk */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray={`${highStroke} ${circumference}`}
                    strokeDashoffset={currentOffset - lowStroke - mediumStroke}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: currentOffset - lowStroke - mediumStroke }}
                    transition={{ duration: 1, delay: 1.1 }}
                  />
                </>
              );
            })()}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
              className="text-2xl font-bold text-white"
            >
              {portfolio.totalTokens}
            </motion.div>
            <div className="text-white/70 text-xs">Tokens</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-white/70">Low Risk</span>
            </div>
            <span className="text-white font-medium">
              {Math.round((portfolio.riskDistribution.low / portfolio.totalTokens) * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span className="text-white/70">Medium Risk</span>
            </div>
            <span className="text-white font-medium">
              {Math.round((portfolio.riskDistribution.medium / portfolio.totalTokens) * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-white/70">High Risk</span>
            </div>
            <span className="text-white font-medium">
              {Math.round((portfolio.riskDistribution.high / portfolio.totalTokens) * 100)}%
            </span>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-semibold text-white mb-3">Token Categories</h4>
          <div className="space-y-1">
            {Object.entries(portfolio.categoryDistribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span className="text-white/60">{category}</span>
                <span className="text-white/80">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}