import { TokenBalance } from '../types/portfolio';

const JUPITER_API_BASE = 'https://https://quote-api.jup.ag/v6/wallet/tokens?wallet=6z5RtEKh2AnUzoX5uwD9YqVxmqDeDF7L8Jzi3pxS6czg-api.jup.ag/v6';

export async function fetchWalletTokens(walletAddress: string): Promise<TokenBalance[]> {
  try {
    const response = await fetch(`${JUPITER_API_BASE}/wallet/tokens?wallet=${walletAddress}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the response to match our TokenBalance interface
    type JupiterToken = {
      mint: string;
      symbol?: string;
      balance: string | number;
      decimals: number;
      uiAmount?: string | number;
    };

    const tokens = data.tokens?.map((token: JupiterToken) => ({
      mint: token.mint,
      symbol: token.symbol || 'UNKNOWN',
      balance: parseInt(token.balance as string),
      decimals: token.decimals,
      uiAmount: parseFloat(token.uiAmount as string) || 0
    })) || [];

    // Enhance with market data
    return await enhanceWithMarketData(tokens);
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    throw new Error('Failed to fetch wallet tokens. Please check the wallet address and try again.');
  }
}

async function enhanceWithMarketData(tokens: TokenBalance[]): Promise<TokenBalance[]> {
  try {
    // Mock market data for demonstration - in production, use real APIs
    return tokens.map(token => ({
      ...token,
      marketCap: Math.random() * 1000000000,
      volume24h: Math.random() * 10000000,
      holderCount: Math.floor(Math.random() * 100000),
      price: Math.random() * 100,
      priceChange24h: (Math.random() - 0.5) * 20
    }));
  } catch (error) {
    console.error('Error enhancing with market data:', error);
    return tokens;
  }
}

export async function fetchTokenPrice(tokenMint: string): Promise<number> {
  try {
    // Mock price data - replace with real API
    // Use tokenMint to avoid unused variable error
    console.log(`Fetching price for token mint: ${tokenMint}`);
    return Math.random() * 100;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return 0;
  }
}

export async function fetchHistoricalPrices(tokenMint: string, days: number = 30): Promise<Array<{date: Date, price: number}>> {
  try {
    // Mock historical data
    const data = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date,
        price: Math.random() * 100
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
}