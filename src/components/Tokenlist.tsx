import React from "react";
import { useBalances } from "../contexts/BalanceContext";
import { useAuth } from "../contexts/AuthContext";
import { token_assets } from "../utils/types";

interface TokenConfig {
  symbol: string;
  name: string;
  image: string;
  decimals: number;
}

const TOKEN_CONFIG: Record<string, TokenConfig> = {
  SOL: {
    symbol: "SOL",
    name: "Solana",
    image: token_assets.SOL,
    decimals: 9,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    image: token_assets.USDC,
    decimals: 6,
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    image: token_assets.USDT,
    decimals: 6,
  },
  JUP: {
    symbol: "JUP",
    name: "Jupiter",
    image: token_assets.JUP,
    decimals: 6,
  },
};

export const TokenList: React.FC = () => {
  const { selectedAccount } = useAuth();
  const { balances, loading, getTokenNative, getTokenUsd } = useBalances();

  if (selectedAccount?.blockChainType === "ETH") {
    const ethBalance = balances.ETH;

    if (!ethBalance) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Assets
        </h3>

        <div className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-3.5 cursor-pointer transition-all active:scale-[0.99]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={token_assets.ETH}
                alt={"ETH"}
                className="w-6 h-6 rounded-full object-contain"
              />
              <div>
                <div className="text-white font-semibold text-sm">Ethereum</div>
                <div className="text-slate-400 text-xs">
                  {ethBalance.native.toFixed(4)} ETH
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold text-sm">
                ${ethBalance.usd.toFixed(2)}
              </div>
              <div className="text-green-400 text-xs font-medium">+2.45%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const solanaTokens = ["SOL", "USDC", "USDT", "JUP"].filter(
    (token) => getTokenNative(token as any) > 0,
  );

  if (solanaTokens.length === 0 && !loading) {
    return (
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Assets
        </h3>
        <div className="bg-slate-800/60 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm">No tokens found</p>
          <p className="text-slate-500 text-xs mt-1">
            Your tokens will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        Assets
      </h3>

      <div className="space-y-2.5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/60 rounded-xl p-3.5 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700" />
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-slate-700 rounded" />
                      <div className="h-3 w-16 bg-slate-700 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-slate-700 rounded ml-auto" />
                    <div className="h-3 w-12 bg-slate-700 rounded ml-auto" />
                  </div>
                </div>
              </div>
            ))
          : solanaTokens.map((tokenSymbol) => {
              const token = TOKEN_CONFIG[tokenSymbol];
              const nativeBalance = getTokenNative(tokenSymbol as any);
              const usdValue = getTokenUsd(tokenSymbol as any);

              const priceChange =
                tokenSymbol === "SOL"
                  ? "+5.23"
                  : tokenSymbol === "USDC"
                    ? "+0.01"
                    : tokenSymbol === "USDT"
                      ? "-0.01"
                      : "+3.45";

              return (
                <div
                  key={tokenSymbol}
                  className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-3.5 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={token.image}
                        alt={token.name}
                        className="w-6 h-6 rounded-full object-contain"
                      />
                      <div>
                        <div className="text-white font-semibold text-sm">
                          {token.name}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {nativeBalance.toFixed(token.decimals === 9 ? 4 : 2)}{" "}
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">
                        ${usdValue.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          priceChange.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {priceChange}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
