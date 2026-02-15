import React, { useState } from 'react';
import { ArrowLeft, Key, AlertCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { token_assets, type Blockchain } from '../utils/types';

export const ImportPrivateKey: React.FC = () => {
  const { setCurrentScreen, importEtheriumAccountViaPrivateKey,importSolanaAccountViaPrivateKey,wallet } = useAuth();
  const [blockchain, setBlockchain] = useState<Blockchain>('SOL');
  const [privateKey, setPrivateKey] = useState('');
  const [showBlockchainMenu, setShowBlockchainMenu] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const blockchains = {
    SOL: { name: 'Solana', symbol: token_assets.SOL, color: 'from-purple-500 to-pink-500' },
    ETH: { name: 'Ethereum', symbol: token_assets.ETH, color: 'from-blue-500 to-cyan-500' },
  };

  const currentBlockchain = blockchains[blockchain];

  const handleImport = async () => {
    setError('');

    if (!privateKey.trim()) {
      setError('Please enter a private key');
      return;
    }

    if (privateKey.length < 32) {
      setError('Invalid private key length');
      return;
    }

    setIsLoading(true);

    try {
      if(blockchain == "SOL"){
        importSolanaAccountViaPrivateKey(privateKey,wallet?.accounts.filter((account) => account.blockChainType == "SOL" ).length ?? 0)
      } else {
        importEtheriumAccountViaPrivateKey(privateKey,wallet?.accounts.filter((account) => account.blockChainType == "ETH" ).length ?? 0)
      }
      
      setCurrentScreen('home');
    } catch (err) {
      setError('Failed to import account. Please check your private key.');
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative">

      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('settings')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-lg font-semibold text-white">Import Private Key</h2>
          <div className="w-9" />
        </div>
      </div>

    
      <div className="flex-1 overflow-y-auto p-5">
      
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Key className="w-8 h-8 text-white" />
          </div>
        </div>


        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Import Account
          </h1>
          <p className="text-slate-400 text-sm">
            Add an existing account using its private key
          </p>
        </div>


        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Blockchain
          </label>
          <div className="relative">
            <button
              onClick={() => setShowBlockchainMenu(!showBlockchainMenu)}
              className="w-full bg-slate-800 hover:bg-slate-750 rounded-xl p-4 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={currentBlockchain.symbol}
                  alt={currentBlockchain.name}
                  className="w-6 h-6 rounded-full object-contain"
                />
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">{currentBlockchain.name}</div>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </button>

            {showBlockchainMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-10 overflow-hidden animate-slide-down">
                {Object.entries(blockchains).map(([key, chain]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setBlockchain(key as 'SOL' | 'ETH');
                      setShowBlockchainMenu(false);
                    }}
                    className="w-full p-3 flex items-center gap-3 hover:bg-slate-700 transition-colors"
                  >
                    <img
                      src={chain.symbol}
                      alt={chain.name}
                      className="w-6 h-6 rounded-full object-contain"
                    />
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">{chain.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Private Key
          </label>
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your private key (base58 or hex format)"
            rows={4}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono text-sm resize-none"
          />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-400 mb-1">Security Warning</p>
              <p className="text-yellow-300/80">
                Never share your private key with anyone. Importing a private key gives full access to the account.
              </p>
            </div>
          </div>
        </div>

  
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
          <p className="text-xs text-blue-300">
            💡 <strong>Tip:</strong> The private key should be in base58 format for Solana or hex format (0x...) for Ethereum.
          </p>
        </div>
      </div>

      
      <div className="p-5 border-t border-slate-800 bg-slate-900">
        <button
          onClick={handleImport}
          disabled={!privateKey.trim() || isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/30 disabled:shadow-none"
        >
          {isLoading ? 'Importing...' : 'Import Account'}
        </button>
      </div>

      {isLoading && (
        <LoadingOverlay message="Importing account..." />
      )}
    </div>
  );
};