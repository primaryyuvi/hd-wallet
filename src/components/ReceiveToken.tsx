import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


export const ReceiveToken: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { selectedAccount , setCurrentScreen } = useAuth()
  const address = selectedAccount?.blockChainType == "ETH" ? selectedAccount?.address : selectedAccount?.publicAddress ?? ""
  const handleCopy = async () => {
    
    try {
      await navigator.clipboard.writeText(address ?? "");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = address ?? "";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${address}&margin=0`;

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative mx-auto border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between p-4 pt-6">
        <button 
          onClick= {() => setCurrentScreen("home")}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-900"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-white text-lg font-bold absolute left-1/2 -translate-x-1/2">
          Deposit
        </h2>
        <div className="w-10" /> 
      </div>

    
      <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-10">
        
       
        <div className="bg-white p-4 rounded-[20px] mb-8 shadow-xl shadow-black/50">
          <div className="w-48 h-48 relative">
           
            <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-lg" />
            <img 
              src={qrCodeUrl} 
              alt="Wallet Address QR Code"
              className="relative z-10 w-full h-full object-contain rendering-pixelated"
              onLoad={(e) => (e.currentTarget.previousElementSibling as HTMLElement).style.display = 'none'}
            />
          </div>
        </div>

  
        <div className="text-center mb-8 px-4">
          <p className="text-white font-medium text-lg break-all leading-relaxed tracking-wide">
            {address}
          </p>
        </div>


        <button
          onClick={handleCopy}
          className="bg-[#1e293b] hover:bg-[#283547] text-[#3b82f6] font-semibold py-3 px-8 rounded-xl transition-all active:scale-95 flex items-center gap-2 mb-12"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    <span>Copied</span>
                </>
            ) : (
                "Copy address"
            )}
        </button>

        <div className="mt-auto text-center px-8 pb-8">
            <p className="text-slate-500 text-xs leading-relaxed">
                This address can only receive assets on {selectedAccount?.blockChainType == "SOL" ? "Solana" : "Etherium"}.
            </p>
        </div>
      </div>
    </div>
  );
};