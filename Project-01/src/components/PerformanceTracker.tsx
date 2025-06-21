import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { HistoricalAnalysis } from '../types/portfolio';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PerformanceTrackerProps {
  currentValue: number;
  walletAddress: string;
  // ...other props if any
}


export default function PerformanceTracker({ currentValue }: PerformanceTrackerProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalAnalysis[]>([]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Mock historical data - in production, fetch from your backend
    const generateMockData = () => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const data: HistoricalAnalysis[] = [];
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date,
          analysis: {
            totalTokens: Math.floor(Math.random() * 20) + 10,
            totalValue: currentValue * (0.8 + Math.random() * 0.4),
            riskDistribution: {
              low: Math.floor(Math.random() * 10),
              medium: Math.floor(Math.random() * 10),
              high: Math.floor(Math.random() * 10)
            },
            categoryDistribution: {},
            overallLabel: 'Normie' as const,
            badge: {
              id: 'test',
              name: 'Test',
              emoji: '⚖️',
              description: 'Test badge',
              rarity: 'common' as const,
              unlockedAt: new Date()
            },
            emoji: '⚖️',
            description: 'Test description',
            riskScore: Math.floor(Math.random() * 100),
            diversificationScore: Math.floor(Math.random() * 100)
          },
          totalValue: currentValue * (0.8 + Math.random() * 0.4),
          tokenCount: Math.floor(Math.random() * 20) + 10
        });
      }
      
      setHistoricalData(data);
    };

    generateMockData();
  }, [timeframe, currentValue]);

  const chartData = {
    labels: historicalData.map(d => d.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Portfolio Value',
        data: historicalData.map(d => d.totalValue),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Risk Score',
        data: historicalData.map(d => d.analysis.riskScore),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Portfolio Performance Over Time',
        color: 'white'
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(this: any, tickValue: string | number) {
            if (typeof tickValue === 'number') {
              return '$' + tickValue.toLocaleString();
            }
            return '$' + tickValue;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  const calculateChange = () => {
    if (historicalData.length < 2) return { value: 0, percentage: 0 };
    
    const latest = historicalData[historicalData.length - 1];
    const previous = historicalData[0];
    
    const valueChange = latest.totalValue - previous.totalValue;
    const percentageChange = (valueChange / previous.totalValue) * 100;
    
    return { value: valueChange, percentage: percentageChange };
  };

  const change = calculateChange();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Performance Tracker
        </h3>
        
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                timeframe === period
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-white/70 text-sm">Current Value</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${change.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-white/70 text-sm">Change ({timeframe})</span>
          </div>
          <div className={`text-2xl font-bold ${change.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change.percentage >= 0 ? '+' : ''}{change.percentage.toFixed(2)}%
          </div>
          <div className={`text-sm ${change.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${change.value >= 0 ? '+' : ''}{change.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-white/70 text-sm">Tracking Since</span>
          </div>
          <div className="text-lg font-bold text-white">
            {historicalData.length > 0 ? historicalData[0].date.toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}