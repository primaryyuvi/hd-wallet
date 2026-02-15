import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TransactionSuccess } from '../components/TransactionSuccess';
import { sendSol } from '../services/solana/server';
import { solanaClient } from '../services/solana/client';
import bs58 from 'bs58'
import { sendEth } from '../services/etherium/server';
import { ethProvider } from '../services/etherium/client';
import { useBalances, BalanceProvider } from '../contexts/BalanceContext';
import { TransactionFailure } from './TransactionFailure';
import { getUsdPrices } from '../services/prices';
import type { PriceMap } from '../utils/types';

const SendTransactionContent: React.FC = () => {
  const { setCurrentScreen, selectedAccount } = useAuth();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
   const [showFailure, setShowFailure] = useState(false);
  const { getTokenNative } = useBalances();
  const [errorMessage, setErrorMessage] = useState('');
  const [prices, setPrices] = useState<number | null>(null);
  
  useEffect(() => {
    let mounted = true;
  
    const fetchPrices = async () => {
      try {
        const data = await getUsdPrices();
        if (mounted) {
          setPrices(() => data[selectedAccount?.blockChainType as keyof PriceMap]);
        }
      } catch (err) {
        console.error("Failed to fetch USD prices", err);
      }
    };
  
    fetchPrices();
  
    return () => {
      mounted = false; 
    };
  }, []);


  const handleSend = async () => {
    if (!amount || !recipient || !selectedAccount) return;

    const sendAmount = parseFloat(amount);

        if (sendAmount > getTokenNative(selectedAccount.blockChainType)) {
          setErrorMessage('Insufficient balance for this transaction');
          setShowFailure(true);
          return;
        }

        if (selectedAccount.blockChainType === 'SOL' && recipient.length < 32) {
          setErrorMessage('Invalid Solana address');
          setShowFailure(true);
          return;
        }

        if (selectedAccount.blockChainType === 'ETH' && !recipient.startsWith('0x')) {
          setErrorMessage('Invalid Ethereum address');
          setShowFailure(true);
          return;
        }

    setIsLoading(true);

    try{
      await new Promise(resolve => setTimeout(resolve, 1500));
      let result;
      if(selectedAccount.blockChainType == "SOL"){
        result = await sendSol(solanaClient.conn, bs58.decode(selectedAccount?.privateAddress ?? ""), recipient, Number(amount))
      } else {
        result = await sendEth(ethProvider,selectedAccount?.privateAddress ?? "",recipient,Number(amount))
      }
      console.log(result)
      setIsLoading(false);
      setShowSuccess(true);
    } catch (e: any) {
      setIsLoading(false)
      setErrorMessage(e.message || 'Transaction failed to send');
      setShowFailure(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setCurrentScreen('home');
  };
  
  const handleFailureClose = () => {
     setShowFailure(false);
     setErrorMessage('');
   };

  const handleSetMax = () => {
    if (selectedAccount) {
      setAmount(getTokenNative(selectedAccount.blockChainType)?.toString() ?? "");
    }
  };

  const amountNum = parseFloat(amount);
   const hasInsufficientBalance = amount && amountNum > getTokenNative(selectedAccount?.blockChainType ?? "SOL");
   const isValid = amount && recipient && amountNum > 0 && !hasInsufficientBalance;

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative">
    
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-lg font-semibold text-white">Send</h2>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={selectedAccount?.blockChainType === 'SOL' ? '7xKXtg2CW87...' : '0x742d35Cc...'}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all font-mono text-sm"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Amount
            </label>
            {selectedAccount && (
              <span className="text-xs text-slate-500">
                Balance: {getTokenNative(selectedAccount.blockChainType).toFixed(4)} {selectedAccount?.blockChainType}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-2xl font-bold"
            />
            <button
              onClick={handleSetMax}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              MAX
            </button>
          </div>
          
          {hasInsufficientBalance && (
                      <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4" />
                        <span>Insufficient balance</span>
                      </div>
                    )}
          
          {amount && selectedAccount && !hasInsufficientBalance &&(
            <div className="mt-2 text-slate-400 text-sm">
              ≈ ${(Number(prices ?? "") * Number(amount)).toFixed(3)} USD
            </div>
          )}
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
          <p className="text-xs text-yellow-300">
            ⚠️ Double-check the recipient address. Transactions cannot be reversed.
          </p>
        </div>
      </div>

      <div className="p-5 border-t border-slate-800 bg-slate-900">
             <button
               onClick={handleSend}
               disabled={!isValid || isLoading}
               className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/30 disabled:shadow-none flex items-center justify-center gap-2"
             >
               {isLoading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>Sending...</span>
                 </>
               ) : (
                 <>
                   <Send className="w-5 h-5" />
                   <span>Send {selectedAccount?.blockChainType}</span>
                 </>
               )}
             </button>
           </div>

  
      {showSuccess && (
        <TransactionSuccess
          type="send"
          details={{
            amount,
            token: selectedAccount?.blockChainType,
            recipient,
          }}
          onClose={handleSuccessClose}
        />
      )}
      
      {showFailure && (
             <TransactionFailure
               error={errorMessage}
               onClose={handleFailureClose}
             />
           )}
    </div>
  );
};

export const SendTransaction: React.FC = () => {
  const { selectedAccount } = useAuth();

  return (
    <BalanceProvider account={selectedAccount}>
      <SendTransactionContent />
    </BalanceProvider>
  );
};
