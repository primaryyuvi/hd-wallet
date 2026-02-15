import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { STORAGE_KEYS, useAuth } from '../contexts/AuthContext';
import { secureGet } from '../utils/crypto';

export const Recovery: React.FC = () => {
  const { setCurrentScreen, wallet} = useAuth();
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[] | null>(null);
  
  useEffect(() => {
      const loadSeed = async () => {
        try {
          const seed = await secureGet(STORAGE_KEYS.SEED_PHRASE);
  
          if (typeof seed === "string") {
            setSeedPhrase(seed.split(" "));
          }
        } catch (err) {
          console.error("Failed to load seed phrase", err);
        }
      };
  
      loadSeed();
    }, []);

  const handleCopy = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  

  if (!wallet) return null;

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative overflow-hidden">

      <div className="relative z-10 flex items-center justify-between p-4 border-b border-slate-800/50">
        <button
          onClick={() => setCurrentScreen('home')}
          className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <h2 className="text-lg font-semibold text-white">Recovery Phrase</h2>
        <div className="w-9" /> 
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-sm mx-auto">
     
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Your Secret Recovery Phrase
            </h1>
          </div>
          
          
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-indigo-200 mb-1">Keep it safe</p>
                <p className="text-slate-400 leading-relaxed">
                  Store this phrase in a secure, offline location. Never share it with anyone.
                </p>
              </div>
            </div>
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-900/20 mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                Reveal Phrase
              </div>
            </button>
          ) : (
            <>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4 relative group">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] rounded-xl pointer-events-none" />
                
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {seedPhrase?.map((word, index) => (
                    <div
                      key={index}
                      className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 flex items-center gap-2.5 hover:border-violet-500/30 transition-colors"
                    >
                      <span className="text-slate-600 text-xs font-mono select-none">{index + 1}.</span>
                      <span className="text-indigo-100 font-medium text-sm tracking-wide">{word}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white font-medium rounded-xl transition-all active:scale-95 mb-6 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setRevealed(false)}
                className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition-all active:scale-95 mb-6 flex items-center justify-center gap-2"
              >
                <EyeOff className="w-5 h-5" />
                <span>Hide Recovery Phrase</span>
              </button>
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-600 cursor-pointer"
                  />
                  <div className="text-sm">
                    <p className="text-white font-medium mb-1">I have saved my recovery phrase</p>
                    <p className="text-slate-400">
                      I understand that I will lose access to my wallet if I lose this phrase
                    </p>
                  </div>
                </label>
              </div>

              <button
                  onClick={() => {
                    setCurrentScreen('home')
                  }}
                disabled={!confirmed}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};