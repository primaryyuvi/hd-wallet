import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowDownUp, ChevronDown, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useBalances } from "../contexts/BalanceContext";
import { token_assets } from "../utils/types";


interface Token {
  name: string;
  symbol: string;
  image: string;
  color: string;
}

const TOKENS: Record<string, Token> = {
  SOL: {
    name: "Solana",
    symbol: "SOL",
    image: token_assets.SOL,
    color: "from-purple-500 to-pink-500",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    image: token_assets.USDC,
    color: "from-blue-500 to-cyan-500",
  },
  USDT: {
    name: "Tether",
    symbol: "USDT",
    image: token_assets.USDT,
    color: "from-green-500 to-emerald-500",
  },
  JUP: {
    name: "Jupiter",
    symbol: "JUP",
    image: token_assets.JUP,
    color: "from-orange-500 to-yellow-500",
  },
};

export const Swap: React.FC = () => {
  const { setCurrentScreen, setSwapData } = useAuth();
  const { getTokenNative,exchangeRates } = useBalances();

  const [sellToken, setSellToken] = useState("SOL");
  const [buyToken, setBuyToken] = useState("USDC");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [showSellMenu, setShowSellMenu] = useState(false);
  const [showBuyMenu, setShowBuyMenu] = useState(false);
  const [lastEdited, setLastEdited] = useState<"sell" | "buy">("sell");

  const getExchangeRate = (from: string, to: string): number => {
    if (from === to) return 1;
    return exchangeRates[from]?.[to] || 0;
  };
  useEffect(() => {
    if (lastEdited === "sell") {
      const val = safeFloat(sellAmount);
      if (val > 0) {
        const rate = getExchangeRate(sellToken, buyToken);
        setBuyAmount((val * rate).toFixed(6));
      } else {
        setBuyAmount("");
      }
    } else if (lastEdited === "buy") {
      const val = safeFloat(buyAmount);
      if (val > 0) {
        const rate = getExchangeRate(buyToken, sellToken);
        setSellAmount((val * rate).toFixed(6));
      } else {
        setSellAmount("");
      }
    }
  }, [sellToken, buyToken, lastEdited]);

  const handleSellAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;

    setSellAmount(value);
    setLastEdited("sell");

    const val = parseFloat(value);
    if (value && !isNaN(val)) {
      const rate = getExchangeRate(sellToken, buyToken);
      const calculated = (val * rate).toFixed(6);
      setBuyAmount(calculated);
    } else {
      setBuyAmount("");
    }
  };

  const handleBuyAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;

    setBuyAmount(value);
    setLastEdited("buy");

    const val = parseFloat(value);
    if (value && !isNaN(val)) {
      const rate = getExchangeRate(buyToken, sellToken);
      const calculated = (val * rate).toFixed(6);
      setSellAmount(calculated);
    } else {
      setSellAmount("");
    }
  };

  const safeFloat = (val: string): number => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateUsdValue = (token: string, amount: string) => {
    if (!amount || isNaN(parseFloat(amount))) return "$0.00";
    const pricePerToken = getExchangeRate(token, "USDC");
    const value = parseFloat(amount) * pricePerToken;
    return `$${value.toFixed(2)}`;
  };

  const handleSwapClick = () => {
    const finalSellAmount = sellAmount || "0";
    const finalBuyAmount = buyAmount || "0";

    const sellUsdValRaw =
      safeFloat(finalSellAmount) * getExchangeRate(sellToken, "USDC");
    const buyUsdValRaw =
      safeFloat(finalBuyAmount) * getExchangeRate(buyToken, "USDC");

    const swapData = {
      fromToken: sellToken,
      toToken: buyToken,
      fromAmount: finalSellAmount,
      toAmount: finalBuyAmount,
      rate: getExchangeRate(sellToken, buyToken),
      fromUsdValue: sellUsdValRaw.toFixed(2),
      toUsdValue: buyUsdValRaw.toFixed(2),
    };

    setSwapData(swapData);
    setCurrentScreen("swap-review");
  };

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    const tempAmount = sellAmount;

    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
    setLastEdited(lastEdited === "sell" ? "buy" : "sell");
  };

  const handlePercentage = (percentage: number) => {
    const tokenBalance = getTokenNative(sellToken as any);
    const amount = ((tokenBalance * percentage) / 100).toFixed(6);
    handleSellAmountChange(amount);
  };

  const handleTokenSelect = (token: string, position: "sell" | "buy") => {
    if (position === "sell") {
      if (token === buyToken) {
        setBuyToken(sellToken);
      }
      setSellToken(token);
      setShowSellMenu(false);
    } else {
      if (token === sellToken) {
        setSellToken(buyToken);
      }
      setBuyToken(token);
      setShowBuyMenu(false);
    }
  };

  const sellBalance = getTokenNative(sellToken as any).toFixed(4);
  const buyBalance = getTokenNative(buyToken as any).toFixed(4);
  const sellAmountUsd = calculateUsdValue(sellToken, sellAmount);
  const buyAmountUsd = calculateUsdValue(buyToken, buyAmount);

  const hasInsufficientBalance =
    sellAmount && parseFloat(sellAmount) > parseFloat(sellBalance);
  const canSwap =
    safeFloat(sellAmount) > 0 &&
    safeFloat(buyAmount) > 0 &&
    !hasInsufficientBalance;
  

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-2 relative z-20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium">Sell</span>
            <span className="text-gray-500 text-xs">
              Balance: {sellBalance} {sellToken}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              placeholder="0"
              value={sellAmount}
              onChange={(e) => handleSellAmountChange(e.target.value)}
              className="bg-transparent text-white text-3xl font-bold outline-none w-full placeholder-gray-700"
            />
            <div className="relative">
              <button
                onClick={() => setShowSellMenu(!showSellMenu)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-850 px-3 py-2 rounded-xl transition-all"
              >
                <img
                  src={TOKENS[sellToken].image}
                  alt={sellToken}
                  className="w-6 h-6 rounded-full object-contain"
                />
                <span className="text-white font-medium">{sellToken}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showSellMenu && (
                <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down min-w-[200px]">
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <button
                      key={key}
                      onClick={() => handleTokenSelect(key, "sell")}
                      className={`w-full p-3 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        key === sellToken ? "bg-slate-800" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={token.image}
                          alt={token.name}
                          className="w-8 h-8 rounded-full object-contain"
                        />
                        <div className="text-left">
                          <div className="text-white font-medium text-sm">
                            {token.symbol}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">
                          {getTokenNative(key as any).toFixed(4)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">{sellAmountUsd}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePercentage(25)}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-850 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                25%
              </button>
              <button
                onClick={() => handlePercentage(50)}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-850 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                50%
              </button>
              <button
                onClick={() => handlePercentage(100)}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-850 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {hasInsufficientBalance && (
            <p className="text-xs text-red-400 mt-2">Insufficient balance</p>
          )}
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="w-10 h-10 bg-gray-900 hover:bg-gray-850 border-2 border-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <ArrowDownUp className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-6 relative z-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium">Buy</span>
            <span className="text-gray-500 text-xs">Balance: {buyBalance}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              placeholder="0"
              value={buyAmount}
              onChange={(e) => handleBuyAmountChange(e.target.value)}
              className="bg-transparent text-white text-3xl font-bold outline-none w-full placeholder-gray-700"
            />

            <div className="relative">
              <button
                onClick={() => setShowBuyMenu(!showBuyMenu)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-850 px-3 py-2 rounded-xl transition-all"
              >
                <img
                  src={TOKENS[buyToken].image}
                  alt={buyToken}
                  className="w-6 h-6 rounded-full object-contain"
                />
                <span className="text-white font-medium">{buyToken}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showBuyMenu && (
                <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down min-w-[200px]">
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <button
                      key={key}
                      onClick={() => handleTokenSelect(key, "buy")}
                      className={`w-full p-3 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        key === buyToken ? "bg-slate-800" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={token.image}
                          alt={token.name}
                          className="w-8 h-8 rounded-full object-contain"
                        />
                        <div className="text-left">
                          <div className="text-white font-medium text-sm">
                            {token.symbol}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">
                          {getTokenNative(key as any).toFixed(4)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">{buyAmountUsd}</span>
          </div>
        </div>

       
        {sellAmount && buyAmount && (
          <div className="mb-4 p-3 bg-slate-800/60 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Rate</span>
              <span className="text-white font-semibold">
                1 {sellToken} ≈{" "}
                {getExchangeRate(sellToken, buyToken).toFixed(4)} {buyToken}
              </span>
            </div>
          </div>
        )}

    
        <button
          onClick={handleSwapClick}
          disabled={!canSwap}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold mb-6 transition-all active:scale-95 shadow-lg shadow-purple-500/30 disabled:shadow-none"
        >
          {hasInsufficientBalance
            ? "Insufficient Balance"
            : !sellAmount
              ? "Enter Amount"
              : "Review Swap"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-[375px] h-[600px] bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen("home")}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-lg font-semibold text-white">Swap</h2>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Sell Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium">Sell</span>
            <span className="text-gray-500 text-xs">
              Balance: {sellBalance} {sellToken}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              placeholder="0"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="bg-transparent text-white text-3xl font-bold outline-none w-full placeholder-gray-700"
            />

            {/* Sell Token Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSellMenu(!showSellMenu)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-850 px-3 py-2 rounded-xl transition-all"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${TOKENS[sellToken].color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}
                >
                  {TOKENS[sellToken].icon}
                </div>
                <span className="text-white font-medium">{sellToken}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Sell Dropdown */}
              {showSellMenu && (
                <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down min-w-[200px]">
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <button
                      key={key}
                      onClick={() => handleTokenSelect(key, "sell")}
                      className={`w-full p-3 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                        key === sellToken ? "bg-slate-700/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${token.color} flex items-center justify-center text-sm font-bold text-white`}
                        >
                          {token.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-white font-medium text-sm">
                            {token.symbol}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">
                          {getTokenNative(key as any).toFixed(4)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">{sellUsdValue}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePercentage(25)}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-850 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                25%
              </button>
              <button
                onClick={() => handlePercentage(50)}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-850 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                50%
              </button>
              <button
                onClick={() => handlePercentage(100)}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-850 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Error Message */}
          {hasInsufficientBalance && (
            <p className="text-xs text-red-400 mt-2">Insufficient balance</p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="w-10 h-10 bg-gray-900 hover:bg-gray-850 border-2 border-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <ArrowDownUp className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {/* Buy Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium">Buy</span>
            <span className="text-gray-500 text-xs">Balance: {buyBalance}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              placeholder="0"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="bg-transparent text-white text-3xl font-bold outline-none w-full placeholder-gray-700"
            />

            {/* Buy Token Selector */}
            <div className="relative">
              <button
                onClick={() => setShowBuyMenu(!showBuyMenu)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-850 px-3 py-2 rounded-xl transition-all"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${TOKENS[buyToken].color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}
                >
                  {TOKENS[buyToken].icon}
                </div>
                <span className="text-white font-medium">{buyToken}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Buy Dropdown */}
              {showBuyMenu && (
                <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down min-w-[200px]">
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <button
                      key={key}
                      onClick={() => handleTokenSelect(key, "buy")}
                      className={`w-full p-3 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                        key === buyToken ? "bg-slate-700/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${token.color} flex items-center justify-center text-sm font-bold text-white`}
                        >
                          {token.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-white font-medium text-sm">
                            {token.symbol}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">
                          {getTokenNative(key as any).toFixed(4)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">{buyUsdValue}</span>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwapClick}
          disabled={!canSwap}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold mb-6 transition-all active:scale-95 shadow-lg shadow-purple-500/30 disabled:shadow-none"
        >
          {hasInsufficientBalance
            ? "Insufficient Balance"
            : !sellAmount
              ? "Enter Amount"
              : "Swap"}
        </button>

        {/* Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex gap-2">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Powered by Jupiter</p>
            <p className="text-blue-300/80 text-xs">
              Best rates across Solana DEXs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
