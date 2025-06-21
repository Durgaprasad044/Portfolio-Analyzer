import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Settings, Zap, Info, Wallet } from 'lucide-react';
import { useSwapQuote, useTokenPrices } from '../../hooks/useJupiter';
import { POPULAR_TOKENS } from '../../config/jupiter';
import toast from 'react-hot-toast';

const SwapInterface: React.FC = () => {
  const { getQuote, quote, loading: quoteLoading } = useSwapQuote();
  const { prices } = useTokenPrices();
  const [fromToken, setFromToken] = useState(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState(POPULAR_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const debounce = setTimeout(() => {
        getQuote(fromToken.mint, toToken.mint, parseFloat(fromAmount), slippage * 100);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [fromAmount, fromToken, toToken, slippage]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
  };

  const handleSwap = async () => {
    if (!quote) {
      toast.error('No quote available');
      return;
    }
    
    // In a real implementation, this would connect to a wallet and execute the swap
    toast.success('Swap would be executed here with wallet connection');
  };

  const TokenSelector = ({ 
    token, 
    onSelect, 
    amount, 
    onAmountChange, 
    label,
    readOnly = false 
  }: any) => (
    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-gray-400 text-sm">Balance: 0.00</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={() => !readOnly && onSelect?.()}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 rounded-lg px-3 py-2 transition-colors"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">{token.symbol}</span>
          </div>
          <span className="text-white font-medium">{token.symbol}</span>
        </button>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => !readOnly && onAmountChange?.(e.target.value)}
          placeholder="0.00"
          readOnly={readOnly}
          className="flex-1 bg-transparent text-white text-xl font-bold placeholder-gray-500 focus:outline-none"
        />
      </div>
      
      {prices[token.mint] && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-400 text-sm">
            ${prices[token.mint].price.toFixed(4)}
          </span>
          {amount && (
            <span className="text-gray-400 text-sm">
              ~${(parseFloat(amount) * prices[token.mint].price).toFixed(2)}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const estimatedOutput = quote ? (parseFloat(quote.outAmount) / 1e9).toFixed(6) : '0.00';

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Swap</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600"
          >
            <h3 className="text-white font-medium mb-3">Slippage Tolerance</h3>
            <div className="flex space-x-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slippage === value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-2 bg-gray-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                step="0.1"
                min="0.1"
                max="50"
              />
            </div>
          </motion.div>
        )}

        {/* Swap Interface */}
        <div className="space-y-2">
          <TokenSelector
            token={fromToken}
            amount={fromAmount}
            onAmountChange={setFromAmount}
            label="From"
          />

          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapTokens}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full border-4 border-gray-800 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5 text-cyan-400" />
            </motion.button>
          </div>

          <TokenSelector
            token={toToken}
            amount={estimatedOutput}
            label="To"
            readOnly
          />
        </div>

        {/* Quote Information */}
        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600"
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">
                  1 {fromToken.symbol} ≈ {(parseFloat(quote.outAmount) / parseFloat(quote.inAmount)).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price Impact</span>
                <span className={`${parseFloat(quote.priceImpactPct) > 1 ? 'text-red-400' : 'text-green-400'}`}>
                  {parseFloat(quote.priceImpactPct).toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage Tolerance</span>
                <span className="text-white">{slippage}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Swap Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSwap}
          disabled={!quote || quoteLoading || !fromAmount}
          className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {quoteLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Swap</span>
            </>
          )}
        </motion.button>

        {/* Warning */}
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-orange-300 text-xs">
              This is a demo interface. To actually swap tokens, you need to connect a Solana wallet.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SwapInterface;