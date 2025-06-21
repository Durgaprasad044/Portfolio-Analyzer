export interface TokenBalance {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
  uiAmount: number;
  marketCap?: number;
  volume24h?: number;
  holderCount?: number;
  price?: number;
}

export interface ShieldData {
  mint: string;
  flagged: boolean;
  isVerified: boolean;
  riskScore: number;
  tags: string[];
}

export interface TokenClassification {
  category: 'Meme' | 'Utility' | 'DeFi' | 'Gaming' | 'NFT' | 'Scam' | 'Rug' | 'Unknown';
  confidence: number;
  aiReasoning: string;
}

export interface AnalyzedToken extends TokenBalance {
  shieldData?: ShieldData;
  riskLevel: 'low' | 'medium' | 'high';
  riskLabel: string;
  classification?: TokenClassification;
  priceChange24h?: number;
  alerts?: TokenAlert[];
}

export interface TokenAlert {
  id: string;
  type: 'risk_increase' | 'new_token' | 'price_drop' | 'volume_spike';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface PortfolioAnalysis {
  totalTokens: number;
  totalValue: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  categoryDistribution: {
    [key: string]: number;
  };
  overallLabel: 'Investor' | 'Normie' | 'Degen';
  badge: UserBadge;
  emoji: string;
  description: string;
  riskScore: number;
  diversificationScore: number;
}

export interface UserBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface WalletAnalysis {
  address: string;
  tokens: AnalyzedToken[];
  analysis: PortfolioAnalysis;
  lastUpdated: Date;
  alerts: TokenAlert[];
  badges: UserBadge[];
}

export interface HistoricalAnalysis {
  date: Date;
  analysis: PortfolioAnalysis;
  totalValue: number;
  tokenCount: number;
}

export interface UserProfile {
  id: string;
  wallets: string[];
  analyses: HistoricalAnalysis[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  };
  createdAt: Date;
}

export interface SocialShareData {
  badge: UserBadge;
  riskScore: number;
  totalTokens: number;
  shareUrl: string;
  imageUrl: string;
}