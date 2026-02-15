import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface TransactionSuccessProps {
  type: 'send' | 'swap';
  details: {
    amount?: string;
    token?: string;
    recipient?: string;
    fromToken?: string;
    toToken?: string;
    fromAmount?: string;
    toAmount?: string;
  };
  onClose: () => void;
}

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
  type,
  details,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-[340px] shadow-2xl animate-slide-up relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-2">
          Transaction Successful!
        </h2>

        <div className="bg-slate-950/50 rounded-xl p-4 mb-4">
          {type === 'send' ? (
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="text-white font-semibold">
                  {details.amount} {details.token}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To</span>
                <span className="text-white font-mono text-xs">
                  {details.recipient?.slice(0, 6)}...{details.recipient?.slice(-4)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400 font-semibold">Confirmed</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Swapped</span>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {details.fromAmount} {details.fromToken}
                  </div>
                  <div className="text-slate-500 text-xs my-0.5">↓</div>
                  <div className="text-green-400 font-semibold">
                    {details.toAmount} {details.toToken}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400 font-semibold">Confirmed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-shrink shadow-lg shadow-green-500/30" />
        </div>

        <p className="text-center text-xs text-slate-500 mt-3">
          Auto-closing in 3 seconds...
        </p>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-shrink {
          animation: shrink 3s linear;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};