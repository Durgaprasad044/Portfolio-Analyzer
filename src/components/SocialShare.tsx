import React, { useState } from 'react';
import { Share2, Twitter, Copy, Download, Camera } from 'lucide-react';
import { SocialShareData } from '../types/portfolio';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SocialShareProps {
  shareData: SocialShareData;
}

export default function SocialShare({ shareData }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const generateShareText = () => {
    return `Just analyzed my #Solana portfolio! 🎯\n\n${shareData.badge.emoji} ${shareData.badge.name}\n📊 Risk Score: ${shareData.riskScore}/100\n🪙 ${shareData.totalTokens} tokens tracked\n\nAnalyze yours at ${shareData.shareUrl}`;
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
    toast.success('Opening Twitter...');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast.success('Share text copied!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const generateBadgeImage = () => {
    // In a real implementation, you'd generate an actual image
    // For now, we'll just show a success message
    toast.success('Badge image generated! (Feature coming soon)');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl text-white transition-all duration-200"
      >
        <Share2 className="w-6 h-6" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{shareData.badge.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">Share Your Badge!</h3>
              <p className="text-white/70">Show off your portfolio analysis results</p>
            </div>

            {/* Badge Preview */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-6 border border-purple-500/30">
              <div className="text-center">
                <div className="text-3xl mb-2">{shareData.badge.emoji}</div>
                <div className="text-white font-bold">{shareData.badge.name}</div>
                <div className="text-white/70 text-sm mb-3">{shareData.badge.description}</div>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{shareData.riskScore}</div>
                    <div className="text-white/60">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{shareData.totalTokens}</div>
                    <div className="text-white/60">Tokens</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center justify-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Share on Twitter
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>

                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </button>
              </div>

              <button
                onClick={generateBadgeImage}
                className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl text-white font-medium transition-colors"
              >
                <Camera className="w-5 h-5" />
                Generate Badge Image
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}