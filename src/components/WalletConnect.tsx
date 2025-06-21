import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onWalletConnected: (publicKey: string) => void;
}

export default function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  const { publicKey, connected } = useWallet();

  React.useEffect(() => {
    if (connected && publicKey) {
      onWalletConnected(publicKey.toString());
    }
  }, [connected, publicKey, onWalletConnected]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-white/70">
          Connect your Solana wallet for seamless portfolio analysis
        </p>
      </div>

      <div className="flex justify-center">
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !rounded-xl !font-semibold !py-4 !px-8 !transition-all !duration-200 !transform hover:!scale-105" />
      </div>

      {connected && publicKey && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
          <p className="text-green-400 text-sm">
            Connected: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </p>
        </div>
      )}
    </div>
  );
}