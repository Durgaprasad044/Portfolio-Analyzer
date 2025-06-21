import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet, BarChart3, Target } from 'lucide-react';
import { useTokenPrices } from '../../hooks/useJupiter';

const PortfolioOverview: React.FC = () => {
  const { prices, loading } = useTokenPrices();

  const portfolioData = {
    totalValue: 45234.67,
    dailyChange: 1234.56,
    dailyChangePercent: 2.81,
    totalTokens: 12,
    totalPositions: 8,
    totalYield: 456.78
  };

  const topHoldings = [
    { symbol: 'SOL', name: 'Solana', amount: 125.45, value: 8543.21, change: 3.45 },
    { symbol: 'USDC', name: 'USD Coin', amount: 15420.0, value: 15420.0, change: 0.01 },
    { symbol: 'RAY', name: 'Raydium', amount: 2435.67, value: 4321.89, change: -1.23 },
    { symbol: 'ORCA', name: 'Orca', amount: 1234.56, value: 2345.67, change: 5.67 },
  ];

  const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Portfolio Value"
          value={`$${portfolioData.totalValue.toLocaleString()}`}
          change={portfolioData.dailyChangePercent}
          isPositive={portfolioData.dailyChange > 0}
        />
        <StatCard
          icon={Wallet}
          title="Total Tokens"
          value={portfolioData.totalTokens}
        />
        <StatCard
          icon={Target}
          title="Active Positions"
          value={portfolioData.totalPositions}
        />
      </div>

      {/* Top Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Top Holdings</h3>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {topHoldings.map((holding, index) => (
            <motion.div
              key={holding.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{holding.symbol}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{holding.name}</h4>
                  <p className="text-gray-400 text-sm">{holding.amount.toLocaleString()} {holding.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">${holding.value.toLocaleString()}</p>
                <div className={`flex items-center space-x-1 ${holding.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {holding.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-sm">{Math.abs(holding.change)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: BarChart3, label: 'Analytics', color: 'from-blue-500 to-cyan-500' },
          { icon: TrendingUp, label: 'Swap', color: 'from-green-500 to-emerald-500' },
          { icon: Target, label: 'Yield Farm', color: 'from-purple-500 to-pink-500' },
          { icon: Wallet, label: 'Connect Wallet', color: 'from-orange-500 to-red-500' },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-medium hover:shadow-lg transition-all duration-200`}
          >
            <action.icon className="w-6 h-6 mx-auto mb-2" />
            {action.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default PortfolioOverview;