import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Volume2, DollarSign, Percent } from 'lucide-react';
import { useTokenPrices } from '../../hooks/useJupiter';

const TokenAnalytics: React.FC = () => {
  const { prices, loading } = useTokenPrices();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
  const [selectedToken, setSelectedToken] = useState('SOL');

  const timeframes = ['1H', '24H', '7D', '30D', '1Y'];

  // Mock chart data - in production, this would come from Jupiter API
  const priceData = [
    { time: '00:00', price: 68.42, volume: 1200000 },
    { time: '04:00', price: 69.15, volume: 980000 },
    { time: '08:00', price: 67.89, volume: 1500000 },
    { time: '12:00', price: 71.23, volume: 2100000 },
    { time: '16:00', price: 72.56, volume: 1800000 },
    { time: '20:00', price: 70.91, volume: 1300000 },
    { time: '24:00', price: 73.45, volume: 1600000 },
  ];

  const tokenMetrics = [
    { name: 'Market Cap', value: '$28.4B', change: 2.45, icon: DollarSign },
    { name: '24h Volume', value: '$1.2B', change: -1.23, icon: Volume2 },
    { name: 'Circulating Supply', value: '461.8M SOL', change: 0, icon: Activity },
    { name: 'Price Change', value: '+5.67%', change: 5.67, icon: Percent },
  ];

  const topMovers = [
    { symbol: 'RAY', name: 'Raydium', price: 1.85, change: 12.45, volume: '45.2M' },
    { symbol: 'ORCA', name: 'Orca', price: 2.34, change: 8.91, volume: '23.1M' },
    { symbol: 'SRM', name: 'Serum', price: 0.45, change: -3.21, volume: '12.8M' },
    { symbol: 'MNGO', name: 'Mango', price: 0.078, change: -5.67, volume: '8.9M' },
  ];

  return (
    <div className="space-y-6">
      {/* Token Selection & Timeframe */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Token Analytics</h2>
          <p className="text-gray-400">Real-time market data and insights</p>
        </div>
        
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <motion.button
              key={timeframe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {timeframe}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Token Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tokenMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className="w-6 h-6 text-cyan-400" />
              {metric.change !== 0 && (
                <div className={`flex items-center space-x-1 ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm">{Math.abs(metric.change)}%</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{metric.name}</p>
              <p className="text-white text-xl font-bold">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Price Chart</h3>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">$73.45</span>
            <div className="flex items-center space-x-1 text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">+5.67%</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Volume Chart & Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="volume" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Movers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Top Movers</h3>
          <div className="space-y-4">
            {topMovers.map((token, index) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{token.symbol}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{token.name}</h4>
                    <p className="text-gray-400 text-sm">Vol: {token.volume}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${token.price}</p>
                  <div className={`flex items-center space-x-1 ${token.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-sm">{Math.abs(token.change)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenAnalytics;