import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { STORAGE_KEYS } from '../contexts/AuthContext';

export const ImportSeedPhrase: React.FC = () => {
  const { setCurrentScreen } = useAuth();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setError('');

    const words = seedPhrase.trim().split(/\s+/);

    if (words.length !== 12 && words.length !== 24) {
      setError('Seed phrase must be 12 or 24 words');
      return;
    }

   
    if (words.some(word => !word || word.length < 2)) {
      setError('Invalid seed phrase format');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem(STORAGE_KEYS.SEED_PHRASE, seedPhrase);
      setCurrentScreen('signup-import');
    } catch (err) {
      setError('Failed to import wallet. Please check your seed phrase.');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0;

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative overflow-hidden">
    
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-slate-800/50">
        <button
          onClick={() => setCurrentScreen('onboarding-choice')}
          className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <h2 className="text-lg font-semibold text-white">Import Wallet</h2>
        <div className="w-9" />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-sm mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center ">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

    
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Import Seed Phrase
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your 12 or 24-word recovery phrase to restore your wallet
            </p>
          </div>

  
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Recovery Phrase
              </label>
              <span className={`text-xs font-mono ${
                wordCount === 12 || wordCount === 24 
                  ? 'text-green-400' 
                  : 'text-slate-500'
              }`}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </span>
            </div>
            <textarea
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              placeholder="Enter your seed phrase separated by spaces"
              rows={6}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none"
            />
          </div>


          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

         
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-300 mb-1">Security Warning</p>
                <p className="text-red-200/80">
                  Never share your seed phrase. Anyone with access to it can control your wallet and funds.
                </p>
              </div>
            </div>
          </div>

      
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-6">
            <p className="text-xs text-blue-300">
              💡 <strong>Tip:</strong> Make sure each word is spelled correctly and separated by a single space.
            </p>
          </div>


          <button
            onClick={handleImport}
            disabled={wordCount < 12 || isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/30 disabled:shadow-none"
          >
            {isLoading ? 'Importing Wallet...' : 'Import Wallet'}
          </button>
        </div>
      </div>

      {isLoading && (
        <LoadingOverlay message="Restoring your wallet..." />
      )}
    </div>
  );
};