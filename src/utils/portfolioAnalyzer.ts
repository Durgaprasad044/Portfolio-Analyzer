import { AnalyzedToken, PortfolioAnalysis, TokenBalance, ShieldData, UserBadge, TokenAlert, TokenClassification } from '../types/portfolio';
import { classifyToken } from '../api/shieldApi';

export async function analyzeToken(token: TokenBalance, shieldData: ShieldData | null): Promise<AnalyzedToken> {
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  let riskLabel = 'Unknown';

  if (shieldData) {
    if (shieldData.flagged) {
      riskLevel = 'high';
      riskLabel = 'Flagged';
    } else if (shieldData.isVerified) {
      riskLevel = 'low';
      riskLabel = 'Verified';
    } else if (shieldData.riskScore > 70) {
      riskLevel = 'high';
      riskLabel = 'High Risk';
    } else if (shieldData.riskScore < 30) {
      riskLevel = 'low';
      riskLabel = 'Low Risk';
    } else {
      riskLevel = 'medium';
      riskLabel = 'Medium Risk';
    }
  }

  // AI Classification
  const classification = await classifyToken(token.mint, token.symbol, {
    marketCap: token.marketCap,
    volume24h: token.volume24h,
    holderCount: token.holderCount
  });

  // Generate alerts
  const alerts = generateTokenAlerts(token, shieldData, classification);

  return {
    ...token,
    shieldData,
    riskLevel,
    riskLabel,
    classification,
    alerts
  };
}

function generateTokenAlerts(token: TokenBalance, shieldData: ShieldData | null, classification: TokenClassification): TokenAlert[] {
  const alerts: TokenAlert[] = [];

  if (shieldData?.flagged) {
    alerts.push({
      id: `${token.mint}-flagged`,
      type: 'risk_increase',
      message: `${token.symbol} has been flagged by Shield API`,
      severity: 'high',
      timestamp: new Date()
    });
  }

  if (classification.category === 'Scam' || classification.category === 'Rug') {
    alerts.push({
      id: `${token.mint}-scam`,
      type: 'risk_increase',
      message: `${token.symbol} classified as potential ${classification.category.toLowerCase()}`,
      severity: 'high',
      timestamp: new Date()
    });
  }

  if (token.priceChange24h && token.priceChange24h < -50) {
    alerts.push({
      id: `${token.mint}-price-drop`,
      type: 'price_drop',
      message: `${token.symbol} dropped ${Math.abs(token.priceChange24h).toFixed(1)}% in 24h`,
      severity: 'medium',
      timestamp: new Date()
    });
  }

  if (token.volume24h && token.volume24h > 10000000) {
    alerts.push({
      id: `${token.mint}-volume-spike`,
      type: 'volume_spike',
      message: `${token.symbol} experiencing high trading volume`,
      severity: 'low',
      timestamp: new Date()
    });
  }

  return alerts;
}

export function analyzePortfolio(tokens: AnalyzedToken[]): PortfolioAnalysis {
  const totalTokens = tokens.length;
  const totalValue = tokens.reduce((sum, token) => sum + (token.price || 0) * token.uiAmount, 0);
  
  const riskDistribution = tokens.reduce(
    (acc, token) => {
      acc[token.riskLevel]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const categoryDistribution = tokens.reduce((acc, token) => {
    const category = token.classification?.category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Calculate percentages
  const highRiskPercentage = (riskDistribution.high / totalTokens) * 100;
  const lowRiskPercentage = (riskDistribution.low / totalTokens) * 100;

  // Calculate risk score (0-100)
  const riskScore = Math.round(
    (riskDistribution.low * 20 + riskDistribution.medium * 50 + riskDistribution.high * 80) / totalTokens
  );

  // Calculate diversification score
  const uniqueCategories = Object.keys(categoryDistribution).length;
  const diversificationScore = Math.min(100, (uniqueCategories / 8) * 100);

  // Determine overall label and badge
  let overallLabel: 'Investor' | 'Normie' | 'Degen';
  let badge: UserBadge;
  let emoji: string;
  let description: string;

  if (highRiskPercentage > 60) {
    overallLabel = 'Degen';
    emoji = '🎲';
    description = 'You love living on the edge with high-risk tokens!';
    badge = {
      id: 'degen-master',
      name: 'Degen Master',
      emoji: '🎲',
      description: 'Fearless risk-taker with 60%+ high-risk tokens',
      rarity: 'epic',
      unlockedAt: new Date()
    };
  } else if (lowRiskPercentage > 60) {
    overallLabel = 'Investor';
    emoji = '🧠';
    description = 'You prefer stable, verified tokens. Smart moves!';
    badge = {
      id: 'wise-investor',
      name: 'Wise Investor',
      emoji: '🧠',
      description: 'Strategic investor with 60%+ low-risk tokens',
      rarity: 'rare',
      unlockedAt: new Date()
    };
  } else {
    overallLabel = 'Normie';
    emoji = '⚖️';
    description = 'You have a balanced mix of risk levels. Playing it safe!';
    badge = {
      id: 'balanced-trader',
      name: 'Balanced Trader',
      emoji: '⚖️',
      description: 'Maintains a balanced risk portfolio',
      rarity: 'common',
      unlockedAt: new Date()
    };
  }

  // Special badges for unique achievements
  if (diversificationScore > 80) {
    badge = {
      id: 'diversification-expert',
      name: 'Diversification Expert',
      emoji: '🌈',
      description: 'Master of portfolio diversification',
      rarity: 'legendary',
      unlockedAt: new Date()
    };
  }

  return {
    totalTokens,
    totalValue,
    riskDistribution,
    categoryDistribution,
    overallLabel,
    badge,
    emoji,
    description,
    riskScore,
    diversificationScore
  };
}

export function calculateAdvancedRiskScore(tokens: AnalyzedToken[]): number {
  let score = 0;
  let totalWeight = 0;

  tokens.forEach(token => {
    const weight = token.uiAmount * (token.price || 1);
    let tokenRisk = 50; // Default medium risk

    if (token.shieldData) {
      if (token.shieldData.flagged) tokenRisk = 90;
      else if (token.shieldData.isVerified) tokenRisk = 10;
      else tokenRisk = token.shieldData.riskScore;
    }

    // Adjust based on market metrics
    if (token.marketCap && token.marketCap < 1000000) tokenRisk += 20; // Low market cap
    if (token.holderCount && token.holderCount < 1000) tokenRisk += 15; // Few holders
    if (token.volume24h && token.volume24h < 10000) tokenRisk += 10; // Low volume

    // Classification adjustments
    if (token.classification) {
      switch (token.classification.category) {
        case 'Scam':
        case 'Rug':
          tokenRisk = 95;
          break;
        case 'Meme':
          tokenRisk += 20;
          break;
        case 'Utility':
        case 'DeFi':
          tokenRisk -= 10;
          break;
      }
    }

    score += tokenRisk * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.min(100, Math.max(0, score / totalWeight)) : 50;
}