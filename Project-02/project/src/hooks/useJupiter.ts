import { useState, useEffect } from 'react';
import axios from 'axios';
import { JUPITER_API_BASE, JUPITER_SWAP_API, TokenPrice, SwapQuote, POPULAR_TOKENS } from '../config/jupiter';

export const useTokenPrices = () => {
  const [prices, setPrices] = useState<Record<string, TokenPrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const tokenIds = POPULAR_TOKENS.map(token => token.mint).join(',');
      const response = await axios.get(`${JUPITER_API_BASE}/price?ids=${tokenIds}`);
      
      const priceData: Record<string, TokenPrice> = {};
      Object.entries(response.data.data).forEach(([mint, data]: [string, any]) => {
        priceData[mint] = {
          id: mint,
          mintSymbol: data.mintSymbol,
          price: data.price,
          timestamp: Date.now()
        };
      });
      
      setPrices(priceData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch token prices');
      console.error('Jupiter API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error, refetch: fetchPrices };
};

export const useSwapQuote = () => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${JUPITER_SWAP_API}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount: Math.floor(amount * 1e9), // Convert to lamports
          slippageBps
        }
      });
      
      setQuote(response.data);
    } catch (err) {
      setError('Failed to get swap quote');
      console.error('Jupiter swap quote error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { quote, loading, error, getQuote };
};