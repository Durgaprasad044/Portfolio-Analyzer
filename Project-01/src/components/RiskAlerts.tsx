import React, { useState } from 'react';
import { TokenAlert } from '../types/portfolio';
import { AlertTriangle, Bell, X, TrendingDown, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface RiskAlertsProps {
  alerts: TokenAlert[];
  onDismissAlert: (alertId: string) => void;
}

export default function RiskAlerts({ alerts, onDismissAlert }: RiskAlertsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  const getAlertIcon = (type: TokenAlert['type']) => {
    switch (type) {
      case 'risk_increase': return <AlertTriangle className="w-4 h-4" />;
      case 'new_token': return <Shield className="w-4 h-4" />;
      case 'price_drop': return <TrendingDown className="w-4 h-4" />;
      case 'volume_spike': return <TrendingUp className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: TokenAlert['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleDismiss = (alertId: string) => {
    onDismissAlert(alertId);
    toast.success('Alert dismissed');
  };

  if (alerts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
      >
        <div className="text-center">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">All Clear!</h3>
          <p className="text-white/70">No active alerts for your portfolio.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Risk Alerts ({alerts.length})
          </h3>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === severity
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {severity} {severity !== 'all' && `(${alerts.filter(a => a.severity === severity).length})`}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-white/50 text-xs">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white text-sm">{alert.message}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="text-white/50 hover:text-white transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && filteredAlerts.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {filteredAlerts.slice(0, 3).map((alert, index) => (
                <div
                  key={alert.id}
                  className={`w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center ${getSeverityColor(alert.severity)}`}
                  style={{ zIndex: 3 - index }}
                >
                  {getAlertIcon(alert.type)}
                </div>
              ))}
              {filteredAlerts.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium">
                  +{filteredAlerts.length - 3}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-white font-medium">
                {filteredAlerts.filter(a => a.severity === 'high').length} High Priority
              </div>
              <div className="text-white/70 text-sm">
                Click expand to view all alerts
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}