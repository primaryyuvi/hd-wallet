import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Key, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { decryptWithPassword } from '../utils/crypto';
import { STORAGE_KEYS } from '../contexts/AuthContext';

export const ViewPrivateKey: React.FC = () => {
  const { setCurrentScreen, selectedAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const privateKey = selectedAccount?.privateAddress;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password');
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return false;
    setIsVerifying(true);
    try{
        const encryptedUser = JSON.parse(raw);
        await new Promise(resolve => setTimeout(resolve, 1000));
      await decryptWithPassword(encryptedUser, password);
      setIsVerified(true)
    } catch (err) {
      console.log(err)
      setError('Incorrect password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(privateKey ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVerified) {
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
            <h2 className="text-lg font-semibold text-white">Private Key</h2>
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
              Verify Your Identity
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your password to view the private key
            </p>
          </div>

          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-300 mb-1">Critical Security Warning</p>
                <p className="text-red-200/80">
                  Anyone with your private key has full access to your account and funds. Never share it with anyone.
                </p>
              </div>
            </div>
          </div>

      
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

 
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

       
            <button
              type="submit"
              disabled={!password || isVerifying}
              className="w-full py-4 bg-gradient-to-br from-purple-600 to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-500/30 disabled:shadow-none"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  
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
          <h2 className="text-lg font-semibold text-white">Private Key</h2>
          <div className="w-9" />
        </div>
      </div>

   
      <div className="flex-1 overflow-y-auto p-5">
       
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Key className="w-8 h-8 text-white" />
          </div>
        </div>

   
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Your Private Key
          </h1>
          <p className="text-slate-400 text-sm">
            {selectedAccount?.name} • {selectedAccount?.blockChainType}
          </p>
        </div>

        
        <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-300 mb-1">⚠️ NEVER SHARE THIS KEY</p>
              <p className="text-red-200/80">
                Anyone with this key has complete control over your account and can steal all your funds.
              </p>
            </div>
          </div>
        </div>

      
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Private Key
            </label>
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {showPrivateKey ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Show</span>
                </>
              )}
            </button>
          </div>
          
          <div className="bg-slate-800 border-2 border-yellow-500/30 rounded-xl p-4">
            <p className="text-white font-mono text-sm break-all">
              {showPrivateKey ? privateKey : '•'.repeat(64)}
            </p>
          </div>
        </div>

      
        <button
          onClick={handleCopy}
          disabled={!showPrivateKey}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 disabled:cursor-not-allowed border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all active:scale-95"
        >
          {copied ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy Private Key</span>
            </>
          )}
        </button>

       
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-xs text-blue-300">
            💡 <strong>Tip:</strong> Store this key in a secure password manager or hardware wallet. Never store it digitally in plain text.
          </p>
        </div>
      </div>
    </div>
  );
};