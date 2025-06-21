import React, { useState, useMemo } from 'react';
import { AnalyzedToken } from '../types/portfolio';
import { Search, Shield, AlertTriangle, CheckCircle, Filter, TrendingUp, TrendingDown, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface TokenTableProps {
  tokens: AnalyzedToken[];
}

export default function TokenTable({ tokens }: TokenTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'symbol' | 'balance' | 'risk' | 'value' | 'change'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = useMemo(() => {
    const cats = new Set(tokens.map(token => token.classification?.category || 'Unknown'));
    return Array.from(cats);
  }, [tokens]);

  const filteredAndSortedTokens = useMemo(() => {
    const filtered = tokens.filter(token => {
      const matchesSearch = token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || token.riskLevel === riskFilter;
      const matchesCategory = categoryFilter === 'all' || token.classification?.category === categoryFilter;
      return matchesSearch && matchesRisk && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'balance':
          comparison = a.uiAmount - b.uiAmount;
          break;
        case 'risk': {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
          break;
        }
        case 'value': {
          const aValue = (a.price || 0) * a.uiAmount;
          const bValue = (b.price || 0) * b.uiAmount;
          comparison = aValue - bValue;
          break;
        }
        case 'change':
          comparison = (a.priceChange24h || 0) - (b.priceChange24h || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tokens, searchTerm, riskFilter, categoryFilter, sortBy, sortOrder]);

  const getRiskIcon = (level: string, verified: boolean, flagged: boolean) => {
    if (flagged) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (verified) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (level === 'low') return <Shield className="w-4 h-4 text-green-400" />;
    if (level === 'medium') return <Shield className="w-4 h-4 text-orange-400" />;
    return <Shield className="w-4 h-4 text-red-400" />;
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Meme': 'bg-pink-500/20 text-pink-400',
      'Utility': 'bg-blue-500/20 text-blue-400',
      'DeFi': 'bg-green-500/20 text-green-400',
      'Gaming': 'bg-purple-500/20 text-purple-400',
      'NFT': 'bg-indigo-500/20 text-indigo-400',
      'Scam': 'bg-red-500/20 text-red-400',
      'Rug': 'bg-red-600/20 text-red-500',
      'Unknown': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category as keyof typeof colors] || colors.Unknown;
  };

  const handleSort = (column: 'symbol' | 'balance' | 'risk' | 'value' | 'change') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Token Analysis ({filteredAndSortedTokens.length} tokens)
        </h3>
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Risk Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-white/50" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Risks</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Brain className="absolute left-3 top-3 w-5 h-5 text-white/50" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th 
                className="px-6 py-4 text-left text-white font-semibold cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center gap-2">
                  Token
                  {sortBy === 'symbol' && (
                    <span className="text-purple-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-white font-semibold cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center justify-end gap-2">
                  Balance
                  {sortBy === 'balance' && (
                    <span className="text-purple-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-white font-semibold cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center justify-end gap-2">
                  Value
                  {sortBy === 'value' && (
                    <span className="text-purple-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-white font-semibold cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('change')}
              >
                <div className="flex items-center justify-end gap-2">
                  24h Change
                  {sortBy === 'change' && (
                    <span className="text-purple-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-center text-white font-semibold">
                Category
              </th>
              <th 
                className="px-6 py-4 text-center text-white font-semibold cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('risk')}
              >
                <div className="flex items-center justify-center gap-2">
                  Risk Level
                  {sortBy === 'risk' && (
                    <span className="text-purple-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-center text-white font-semibold">
                Shield Status
              </th>
              <th className="px-6 py-4 text-center text-white font-semibold">
                Alerts
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTokens.map((token, index) => (
              <motion.tr 
                key={token.mint}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{token.symbol}</div>
                      <div className="text-white/50 text-xs font-mono">
                        {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-white font-medium">
                    {token.uiAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 6
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-white font-medium">
                    ${((token.price || 0) * token.uiAmount).toLocaleString(undefined, {
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-white/50 text-xs">
                    ${(token.price || 0).toFixed(4)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`flex items-center justify-end gap-1 ${
                    (token.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(token.priceChange24h || 0) >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {(token.priceChange24h || 0).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(token.classification?.category || 'Unknown')}`}>
                    <Brain className="w-3 h-3" />
                    {token.classification?.category || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(token.riskLevel)}`}>
                    {getRiskIcon(
                      token.riskLevel,
                      token.shieldData?.isVerified || false,
                      token.shieldData?.flagged || false
                    )}
                    {token.riskLabel}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {token.shieldData?.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {token.shieldData?.flagged && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged
                      </span>
                    )}
                    {!token.shieldData?.isVerified && !token.shieldData?.flagged && (
                      <span className="text-white/50 text-xs">Unknown</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {token.alerts && token.alerts.length > 0 ? (
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        {token.alerts.length}
                      </span>
                    </div>
                  ) : (
                    <span className="text-white/30 text-xs">None</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedTokens.length === 0 && (
          <div className="text-center py-12 text-white/50">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tokens found matching your criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}