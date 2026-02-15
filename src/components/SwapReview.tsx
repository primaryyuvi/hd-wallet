import React, { useState } from 'react';
import { ArrowLeft, ArrowDownUp, AlertCircle,Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TransactionSuccess } from '../components/TransactionSuccess';
import { executeJupiterSwap, type SwapParams } from '../services/swap/jupiter';
import { solanaClient } from '../services/solana/client';
import { Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import { token_assets, TOKEN_MINTS } from '../utils/types';
import { TransactionFailure } from './TransactionFailure';


export const SwapReview: React.FC = () => {
  const { setCurrentScreen, swapData, selectedAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!swapData) {
    setCurrentScreen('home');
    return null;
  }

  const { fromToken, toToken, fromAmount, toAmount, rate, fromUsdValue, toUsdValue } = swapData;

  const handleApproveSwap = async () => {
    setIsLoading(true);
    try{
    const fromMint = TOKEN_MINTS[fromToken as keyof typeof TOKEN_MINTS];
    const toMint = TOKEN_MINTS[toToken as keyof typeof TOKEN_MINTS];
    console.log(fromMint)
    console.log(toMint)
    const fromAmountSol = fromToken == "SOL" ? Number(fromAmount) * 1000000000 : Number(fromAmount)

    await new Promise(resolve => setTimeout(resolve, 2000));
    const params: SwapParams = {
      connection: solanaClient.conn,
      walletKeypair: Keypair.fromSecretKey(bs58.decode(selectedAccount?.privateAddress ?? "")),
      fromAmount: fromAmountSol,
      fromMint: fromMint,
      toMint : toMint
    }
    const response = await executeJupiterSwap(
      params
    )
    console.log(response)
    if (response.success == true) {
      setIsLoading(false);
      setShowSuccess(true);
    } else {
      setIsLoading(false);
      setErrorMessage(response.error ?? "")
      setShowFailure(true)
    }
    
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message || 'Swap transaction failed');
      setShowFailure(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setCurrentScreen('home');
  };
  
  const handleFailureClose = () => {
    setShowFailure(false);
  };

  // Token colors
  const getTokenColor = (token: string) => {
    const colors: Record<string, string> = {
      SOL: 'from-purple-500 to-pink-500',
      USDC: 'from-blue-500 to-cyan-500',
      USDT: 'from-green-500 to-emerald-500',
      JUP: 'from-orange-500 to-yellow-500',
    };
    return colors[token] || 'from-gray-500 to-gray-600';
  };

  const getTokenIcon = (token: string) => {
    const icons: Record<string, string> = {
      SOL: token_assets.SOL,
      USDC: token_assets.USDC,
      USDT: token_assets.USDT,
      JUP: token_assets.JUP,
    };
    return icons[token] || token.charAt(0);
  };

  const networkFee = '0.000005';
  const networkFeeUsd = '0.001';

  const priceImpact = '0.05';

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
          <h2 className="text-lg font-semibold text-white">Review Swap</h2>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-6">
          <div className="bg-slate-800/60 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getTokenIcon(fromToken)}
                  alt={fromToken}
                  className="w-6 h-6 rounded-full object-contain"
                />
                <div>
                  <div className="text-slate-400 text-xs">From</div>
                  <div className="text-white font-bold text-xl">{parseFloat(fromAmount).toFixed(2)}</div>
                  <div className="text-slate-500 text-xs">${fromUsdValue}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{fromToken}</div>
              </div>
            </div>
          </div>


          <div className="flex justify-center -my-2 z-10 relative">
            <div className="w-10 h-10 bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center">
              <ArrowDownUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>


          <div className="bg-slate-800/60 rounded-xl p-4 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getTokenIcon(toToken)}
                  alt={toToken}
                  className="w-6 h-6 rounded-full object-contain"
                />
                <div>
                  <div className="text-slate-400 text-xs">To</div>
                  <div className="text-green-400 font-bold text-xl">{parseFloat(toAmount).toFixed(2)}</div>
                  <div className="text-slate-500 text-xs">${toUsdValue}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{toToken}</div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-slate-800/60 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Rate</span>
            <span className="text-white font-semibold">
              1 {fromToken} = {rate.toFixed(2)} {toToken}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Price Impact</span>
              <Info className="w-3 h-3 text-slate-500" />
            </div>
            <span className="text-green-400 font-semibold">{priceImpact}%</span>
          </div>

          <div className="border-t border-slate-700 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Network Fee</span>
              <div className="text-right">
                <div className="text-white font-semibold">{networkFee} {fromToken}</div>
                <div className="text-slate-500 text-xs">${networkFeeUsd}</div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-2 border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-purple-300 font-semibold">You'll receive</span>
            <div className="text-right">
              <div className="text-white font-bold text-lg">{parseFloat(toAmount).toFixed(2)} {toToken}</div>
              <div className="text-purple-300 text-sm">${toUsdValue}</div>
            </div>
          </div>
        </div>


        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-300 mb-1">Important</p>
              <p className="text-yellow-200/80">
                Output is estimated. You will receive at least {(parseFloat(toAmount) * 0.995).toFixed(6)} {toToken} or the transaction will revert.
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="p-5 border-t border-slate-800 bg-slate-900 space-y-3">
        <button
          onClick={handleApproveSwap}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Swapping...</span>
            </>
          ) : (
            <span>Approve Swap</span>
          )}
        </button>

        <button
          onClick={() => setCurrentScreen('home')}
          disabled={isLoading}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>


      {showSuccess && (
        <TransactionSuccess
          type="swap"
          details={{
            fromToken,
            toToken,
            fromAmount,
            toAmount,
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
