import React from "react";
import { ArrowLeft, Key, Shield, ChevronRight, Wallet } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Settings: React.FC = () => {
  const { setCurrentScreen, user } = useAuth();

  const menuItems = [
    {
      id: "import-key",
      icon: Key,
      label: "Import Private Key",
      description: "Add account from private key",
      action: () => setCurrentScreen("import-private-key"),
    },
    {
      id: "private-key",
      icon: Key,
      label: "Show Private Key",
      description: "View account private key",
      action: () => setCurrentScreen("view-private-key"),
    },
    {
      id: "recovery",
      icon: Shield,
      label: "Show Recovery Phrase",
      description: "Backup your seed phrase",
      action: () => setCurrentScreen("recovery"),
    },
  ];

  return (
      <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative">
  
      
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 px-4 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen("home")}
              className="p-2 hover:bg-slate-800 rounded-xl transition-all active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            <h2 className="text-lg font-semibold text-white tracking-tight">Settings</h2>
            <div className="w-9" />
          </div>
        </div>
  
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide relative z-10">
          
         
          <div className="px-1 mb-3 mt-2 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security & Keys</span>
          </div>
  
     
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full group relative overflow-hidden bg-slate-900/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors border border-transparent ${
                      item.warning 
                      ? 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 group-hover:border-orange-500/10' 
                      : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/10'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  
  
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold text-sm mb-1 ${
                        item.warning ? 'text-orange-50' : 'text-slate-100'
                    }`}>
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.description}
                    </p>
                  </div>
  
                  <ChevronRight className={`w-5 h-5 transition-all group-hover:translate-x-0.5 ${
                      item.warning ? 'text-orange-500/50 group-hover:text-orange-400' : 'text-slate-600 group-hover:text-slate-400'
                  }`} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            ))}
          </div>
  
        </div>
      </div>
    );
};
