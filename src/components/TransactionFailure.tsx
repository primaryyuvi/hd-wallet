import React from 'react';
import { XCircle, X } from 'lucide-react';

interface TransactionFailureProps {
  error: string;
  onClose: () => void;
}

export const TransactionFailure: React.FC<TransactionFailureProps> = ({ error, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4 animate-shake">
              <XCircle className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Transaction Failed
            </h2>

            {/* Error Message */}
            <p className="text-slate-300 text-sm mb-1">
              Your transaction could not be completed
            </p>
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mt-3 w-full">
              {error}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};