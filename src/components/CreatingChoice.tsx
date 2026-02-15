import React from 'react';
import { Wallet, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const OnboardingChoice: React.FC = () => {
  const { setCurrentScreen } = useAuth();

  return (
    <div className="w-[375px] h-[600px] bg-slate-950  flex flex-col items-center justify-center p-6 relative overflow-hidden">

      <div className="relative z-10 w-full max-w-sm">
    
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Hd Wallet
          </h1>
          <p className="text-slate-400 text-center">
            Your gateway to Web3
          </p>
        </div>

        
        <div className="space-y-4 animate-slide-up">
          <button
            onClick={() => setCurrentScreen('signup')}
            className="w-full group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 group-hover:border-transparent transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Create New Wallet
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Set up a new wallet with recovery phrase
                  </p>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('import-seed')}
            className="w-full group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 group-hover:border-transparent transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Import Seed Phrase
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Restore wallet from recovery phrase
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};