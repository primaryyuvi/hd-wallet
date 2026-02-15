import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  Home as HomeIcon,
  ArrowLeftRight,
  Send,
  Download,
  MoreVertical,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Shield,
  Plus,
  Check as CheckIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Blockchain } from "../utils/types";
import { Swap } from "./SwapPage";
import { BalanceProvider } from "../contexts/BalanceContext";
import { useBalances } from "../contexts/BalanceContext";
import { TokenList } from "./Tokenlist";

type Menu = "account" | "blockchaintype" | "settings" | null;

const CHAIN_GRADIENTS: Record<string, string> = {
  SOL: "from-purple-500 to-pink-500",
  ETH: "from-blue-500 to-cyan-500",
};

const HomeContent: React.FC = () => {
  const {
    wallet,
    selectedAccount,
    lock,
    setCurrentScreen,
    createNewAccount,
    selectAccount,
  } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "swap">("home");
  const [blockChainType, setBlockChainType] = useState<Blockchain>(
    selectedAccount?.blockChainType ?? "SOL",
  );
  const [openMenu, setOpenMenu] = useState<Menu>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { loading, getTokenNative, getTokenUsd } = useBalances();

  useEffect(() => {
    if (!openMenu) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const handleCopy = () => {
    if (selectedAccount) {
      navigator.clipboard.writeText(
        selectedAccount.blockChainType == "SOL"
          ? (selectedAccount.publicAddress ?? "")
          : (selectedAccount.address ?? ""),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLock = () => {
    setOpenMenu(null);
    lock();
  };
  
  const handleSwap = () => {
    if (selectedAccount?.blockChainType == "ETH") {
      console.log("No swapping for eth tokens right now")
      return
    } 
    setActiveTab("swap")
  }
  
  const handleReceiveClick = () => {
    setCurrentScreen("receive-token")
  }

  const handleBlockChainType = (type: Blockchain) => {
    if (wallet == null) return;
    const typeAccounts = wallet.accounts.filter(
      (acc) => acc.blockChainType === type,
    );
    selectAccount(typeAccounts[0].id);
    setBlockChainType(type);
    setOpenMenu(null);
  };

  const handleCreateNewAccount = () => {
    createNewAccount(blockChainType);
    setOpenMenu(null);
  };

  const handleSendClick = () => {
    setCurrentScreen("send");
  };

  if (!wallet || !selectedAccount) return null;

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative">
     
      {activeTab == "home" && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenMenu("blockchaintype")}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="text-white text-sm font-medium truncate max-w-[120px]">
                  {blockChainType}
                </span>
              </button>
              <button
                onClick={() => setOpenMenu("account")}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="text-white text-sm font-medium truncate max-w-[120px]">
                  {selectedAccount.name}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </button>
            </div>

          
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <button
                onClick={() => setOpenMenu("settings")}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {openMenu == "blockchaintype" && (
            <div
              ref={menuRef}
              className="absolute top-16 left-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down min-w-[180px]"
            >
              <button
                onClick={() => handleBlockChainType("SOL")}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
              >
                <span className="text-white text-sm">Solana</span>
              </button>
              <button
                onClick={() => handleBlockChainType("ETH")}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left border-t border-slate-700"
              >
                <span className="text-white text-sm">Etherium</span>
              </button>
            </div>
          )}

          {openMenu == "account" && (
            <div
              ref={menuRef}
              className="absolute top-16 left-4 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down"
            >
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <div className="px-3 py-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {blockChainType} accounts
                </div>
                {wallet.accounts
                  .filter((acc) => acc.blockChainType === blockChainType)
                  .map((account) => (
                    <button
                      key={account.id}
                      onClick={() => {
                        selectAccount(account.id);
                        setOpenMenu(null);
                      }}
                      className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br ${
                            CHAIN_GRADIENTS[account.blockChainType] ??
                            "from-gray-500 to-gray-700"
                          }`}
                        >
                          {account.name.split(" ")[1]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium">
                            {account.name}
                          </div>
                          <div className="text-slate-400 text-xs truncate">
                            {account.blockChainType == "SOL"
                              ? (account.publicAddress?.slice(0, 20) ?? "")
                              : account.address}
                            ...
                          </div>
                        </div>
                      </div>
                      {account.id === selectedAccount.id && (
                        <CheckIcon
                          className={`w-4 h-4 flex-shrink-0 ${
                            account.blockChainType === "ETH"
                              ? "text-blue-400"
                              : "text-purple-400"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                <button
                  onClick={handleCreateNewAccount}
                  className="w-full mt-2 px-3 py-2.5 flex items-center gap-2 hover:bg-slate-700 rounded-lg transition-colors text-purple-400 font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab == "swap" && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Swap</h2>
            <div className="w-9" />
          </div>
        </div>
      )}

      
      {openMenu == "settings" && (
        <div
          ref={menuRef}
          className="absolute top-16 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down min-w-[180px]"
        >
          <button
            onClick={() => {
              setOpenMenu(null);
              setCurrentScreen("settings");
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-white text-sm">Settings</span>
          </button>
          <button
            onClick={handleLock}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left border-t border-slate-700"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">Lock Wallet</span>
          </button>
        </div>
      )}

     
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" ? (
          <div className="p-5">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Total Balance
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showBalance ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {showBalance ? (
                <>
                  <div className="text-5xl font-bold text-slate-300 bg-clip-text mb-1.5 animate-shimmer leading-tight">
                    {loading
                      ? "Loading"
                      : (getTokenNative(
                          selectedAccount.blockChainType,
                        )?.toFixed(4) ?? "Error")}
                  </div>
                  <div className="text-lg text-slate-400 font-semibold">
                    {loading
                      ? "Loading"
                      : `~ $${getTokenUsd(selectedAccount.blockChainType)?.toFixed(2) ?? "0.0"}`}
                  </div>
                </>
              ) : (
                <div className="text-5xl font-bold text-slate-700">••••••</div>
              )}
            </div>

            <div className="mb-6">
              <button
                onClick={() => setCurrentScreen("recovery")}
                className="w-full group relative overflow-hidden rounded-2xl"
              >
                <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4 border border-violet-500/20 hover:border-violet-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Shield className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-base font-bold text-violet-100 mb-0.5">
                        Backup Recovery Phrase
                      </h3>
                      <p className="text-indigo-200/60 text-xs leading-relaxed">
                        Save your 12-word recovery phrase to restore your wallet if needed
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={handleSendClick}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2.5 transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-semibold">Send</span>
              </button>

              <button
                onClick={handleReceiveClick}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2.5 transition-all active:scale-95 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-semibold">
                  Receive
                </span>
              </button>

              <button
                onClick={handleSwap}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2.5 transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
                  <ArrowLeftRight className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-semibold">Swap</span>
              </button>
            </div>
            
            <TokenList />
            
          </div>
        ) : (
          <Swap />
        )}
      </div>

      {selectedAccount.blockChainType == "SOL" && <div className="bg-slate-900 border-t border-slate-800 px-6 py-2.5">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-1.5 transition-colors ${activeTab === "home"
                ? "text-slate-300"
                : "text-slate-700 hover:text-slate-400"
              }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("swap")}
            className={`flex flex-col items-center gap-1 py-1.5 transition-colors ${activeTab === "swap"
                ? "text-slate-300"
                : "text-slate-700 hover:text-slate-400"
              }`}
          >
            <ArrowLeftRight className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Swap</span>
          </button>
        </div>
      </div>}
    </div>
  );
};

// Home.tsx
export const Home: React.FC = () => {
  const { selectedAccount } = useAuth();

  return (
    <BalanceProvider account={selectedAccount}>
      <HomeContent />
    </BalanceProvider>
  );
};
