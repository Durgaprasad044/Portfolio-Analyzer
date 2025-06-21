import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, DollarSign, Clock, Target, Zap } from 'lucide-react';

const YieldDashboard: React.FC = () => {
  const yieldPools = [
    {
      protocol: 'Raydium',
      pair: 'SOL-USDC',
      apy: 12.45,
      tvl: '45.2M',
      rewards: ['RAY', 'SOL'],
      userStaked: 1250.67,
      earnings: 45.23,
      logo: 'RAY'
    },
    {
      protocol: 'Orca',
      pair: 'ORCA-SOL',
      apy: 18.91,
      tvl: '23.8M',
      rewards: ['ORCA'],
      userStaked: 890.12,
      earnings: 78.45,
      logo: 'ORCA'
    },
    {
      protocol: 'Marinade',
      pair: 'mSOL-SOL',
      apy: 6.73,
      tvl: '156.7M',
      rewards: ['MNDE'],
      userStaked: 0,
      earnings: 0,
      logo: 'mSOL'
    },
    {
      protocol: 'Saber',
      pair: 'USDC-USDT',
      apy: 8.24,
      tvl: '89.1M',
      rewards: ['SBR'],
      userStaked: 2345.78,
      earnings: 123.45,
      logo: 'SBR'
    }
  ];

  const totalStats = {
    totalStaked: 4486.57,
    totalEarnings: 247.13,
    avgApy: 11.58,
    activePools: 3
  };

  const StatsCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-r ${color} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Yield Farming</h2>
          <p className="text-gray-400">Earn rewards by providing liquidity</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Sprout className="w-5 h-5" />
          <span>Explore Pools</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={DollarSign}
          title="Total Staked"
          value={`$${totalStats.totalStaked.toLocaleString()}`}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={TrendingUp}
          title="Total Earnings"
          value={`$${totalStats.totalEarnings.toLocaleString()}`}
          subtitle="Last 30 days"
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={Target}
          title="Avg APY"
          value={`${totalStats.avgApy}%`}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Sprout}
          title="Active Pools"
          value={totalStats.activePools}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Yield Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Available Pools</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm font-medium">
              All
            </button>
            <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-500">
              Staked
            </button>
            <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-500">
              High APY
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {yieldPools.map((pool, index) => (
            <motion.div
              key={`${pool.protocol}-${pool.pair}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/50"
            >
              <div className="flex items-center justify-between">
                {/* Pool Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{pool.logo}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-bold">{pool.pair}</h4>
                      <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                        {pool.protocol}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-green-400 font-bold">{pool.apy}% APY</span>
                      <span className="text-gray-400 text-sm">TVL: ${pool.tvl}</span>
                    </div>
                  </div>
                </div>

                {/* User Position */}
                <div className="text-right">
                  {pool.userStaked > 0 ? (
                    <div>
                      <p className="text-white font-medium">${pool.userStaked.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+${pool.earnings}</p>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-cyan-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Stake
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Rewards:</span>
                  <div className="flex space-x-1">
                    {pool.rewards.map((reward) => (
                      <span
                        key={reward}
                        className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-2 py-1 rounded"
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
                
                {pool.userStaked > 0 && (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                    >
                      Claim
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Unstake
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6"
        >
          <Sprout className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Auto-Compound</h3>
          <p className="text-gray-400 text-sm mb-4">
            Automatically reinvest your rewards to maximize yields
          </p>
          <button className="text-green-400 hover:text-green-300 font-medium text-sm">
            Enable →
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6"
        >
          <Clock className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Vesting Schedule</h3>
          <p className="text-gray-400 text-sm mb-4">
            Track your locked rewards and vesting timeline
          </p>
          <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
            View Schedule →
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6"
        >
          <Zap className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Flash Loans</h3>
          <p className="text-gray-400 text-sm mb-4">
            Leverage flash loans for advanced yield strategies
          </p>
          <button className="text-purple-400 hover:text-purple-300 font-medium text-sm">
            Learn More →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default YieldDashboard;