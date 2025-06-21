import { ShieldData, TokenClassification } from '../types/portfolio';

const SHIELD_API_BASE = 'https://shield.jup.ag';

export async function fetchTokenShieldData(tokenMint: string): Promise<ShieldData | null> {
  try {
    const response = await fetch(`${SHIELD_API_BASE}/token/${tokenMint}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // Token not found in Shield API - return default data
        return {
          mint: tokenMint,
          flagged: false,
          isVerified: false,
          riskScore: 50, // Default medium risk
          tags: []
        };
      }
      throw new Error(`Shield API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      mint: tokenMint,
      flagged: data.flagged || false,
      isVerified: data.isVerified || false,
      riskScore: data.riskScore || 50,
      tags: data.tags || []
    };
  } catch (error) {
    console.error(`Error fetching shield data for ${tokenMint}:`, error);
    // Return default data instead of throwing to prevent breaking the entire analysis
    return {
      mint: tokenMint,
      flagged: false,
      isVerified: false,
      riskScore: 50,
      tags: []
    };
  }
}

export async function fetchMultipleTokenShieldData(tokenMints: string[]): Promise<(ShieldData | null)[]> {
  const promises = tokenMints.map(mint => fetchTokenShieldData(mint));
  return Promise.all(promises);
}

export async function classifyToken(tokenMint: string, symbol: string, marketData: any): Promise<TokenClassification> {
  try {
    // AI-driven classification logic (mock implementation)
    const categories = ['Meme', 'Utility', 'DeFi', 'Gaming', 'NFT', 'Scam', 'Rug', 'Unknown'] as const;
    
    // Simple heuristic-based classification
    let category: TokenClassification['category'] = 'Unknown';
    let confidence = 0.5;
    let reasoning = 'Classification based on token characteristics';

    if (symbol.toLowerCase().includes('doge') || symbol.toLowerCase().includes('shib') || symbol.toLowerCase().includes('pepe')) {
      category = 'Meme';
      confidence = 0.8;
      reasoning = 'Token name suggests meme token characteristics';
    } else if (marketData?.marketCap > 1000000000) {
      category = 'Utility';
      confidence = 0.7;
      reasoning = 'High market cap suggests established utility token';
    } else if (marketData?.holderCount < 100) {
      category = 'Rug';
      confidence = 0.6;
      reasoning = 'Very low holder count raises rug pull concerns';
    } else if (marketData?.volume24h < 1000) {
      category = 'Scam';
      confidence = 0.5;
      reasoning = 'Extremely low trading volume is suspicious';
    }

    return {
      category,
      confidence,
      aiReasoning: reasoning
    };
  } catch (error) {
    console.error('Error classifying token:', error);
    return {
      category: 'Unknown',
      confidence: 0,
      aiReasoning: 'Classification failed'
    };
  }
}