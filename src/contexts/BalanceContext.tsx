import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getSolBalance,getSplBalances } from "../services/solana/server";
import { getEthBalance } from "../services/etherium/server";
import { getUsdPrices } from "../services/prices";
import { solanaClient } from "../services/solana/client";
import { ethProvider } from "../services/etherium/client";
import type { WalletAccount,TokenBalance,AllBalances } from "../utils/types";
import { TOKEN_MINTS } from "../utils/types";


interface BalanceContextType {
  balances: AllBalances;
  exchangeRates: Record<string, Record<string, number>>;
  loading: boolean;
  refresh: () => Promise<void>;
  getTokenBalance: (token: keyof AllBalances) => TokenBalance | null;
  getTokenUsd: (token: keyof AllBalances) => number;
  getTokenNative: (token: keyof AllBalances) => number;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
  children: React.ReactNode;
  account: WalletAccount | null;
}
const INITIAL_RATES = {
  SOL: { USDC: 0, USDT: 0, JUP: 0, SOL: 1 },
  USDC: { SOL: 0, USDT: 1, JUP: 0, USDC: 1 },
  USDT: { SOL: 0, USDC: 1, JUP: 0, USDT: 1 },
  JUP: { SOL: 0, USDC: 0, USDT: 0, JUP: 1 },
};

function getTokenBalanceFromAccounts(
  accounts: Array<{ mint: string; amount: number }>,
  mintAddress: string,
): number {
  const account = accounts.find((acc) => acc.mint === mintAddress);
  return account?.amount || 0;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
  children,
  account,
}) => {
  const [balances, setBalances] = useState<AllBalances>({
    SOL: null,
    ETH: null,
    USDC: null,
    USDT: null,
    JUP: null,
  });
  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, Record<string, number>>>(INITIAL_RATES);

  const refresh = useCallback(async () => {
    if (!account) return;

    setLoading(true);

    try {
      const prices = await getUsdPrices();
      const tokens = ['SOL', 'USDC', 'USDT', 'JUP'];
            const newRates: Record<string, Record<string, number>> = {};
            
            tokens.forEach(base => {
              newRates[base] = {};
              tokens.forEach(quote => {
                if (base === quote) {
                  newRates[base][quote] = 1;
                } else {
                  const basePrice = prices[base as keyof typeof prices] || 0;
                  const quotePrice = prices[quote as keyof typeof prices] || 0;
                  newRates[base][quote] = quotePrice > 0 ? basePrice / quotePrice : 0;
                }
              });
            });
            setExchangeRates(newRates);
      if (account.blockChainType === "SOL") {
        const [solNative, splAccounts] = await Promise.all([
          getSolBalance(solanaClient.conn, account.publicAddress!),
          getSplBalances(solanaClient.conn, account.publicAddress!),
        ]);
        console.log(splAccounts)
        
        const usdcNative = getTokenBalanceFromAccounts(
          splAccounts,
          TOKEN_MINTS.USDC,
        );
        const usdtNative = getTokenBalanceFromAccounts(
          splAccounts,
          TOKEN_MINTS.USDT,
        );
        const jupNative = getTokenBalanceFromAccounts(
          splAccounts,
          TOKEN_MINTS.JUP,
        );

        setBalances({
          SOL: {
            native: solNative,
            usd: solNative * prices.SOL,
          },
          ETH: null,
          USDC: {
            native: usdcNative,
            usd: usdcNative * prices.USDC,
          },
          USDT: {
            native: usdtNative,
            usd: usdtNative * prices.USDT,
          },
          JUP: {
            native: jupNative,
            usd: jupNative * prices.JUP,
          },
        });
      } else if (account.blockChainType === "ETH") {
        const ethNative = await getEthBalance(ethProvider, account.address!);

        setBalances({
          SOL: null,
          ETH: {
            native: ethNative,
            usd: ethNative * prices.ETH,
          },
          USDC: null,
          USDT: null,
          JUP: null,
        });
      }
    } catch (e) {
      console.error("Error fetching balances:", e);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    refresh();
  }, [account?.id]);
  
  

  const getTokenBalance = useCallback(
    (token: keyof AllBalances): TokenBalance | null => {
      return balances[token];
    },
    [balances],
  );

  const getTokenUsd = useCallback(
    (token: keyof AllBalances): number => {
      return balances[token]?.usd || 0;
    },
    [balances],
  );

  const getTokenNative = useCallback(
    (token: keyof AllBalances): number => {
      return balances[token]?.native || 0;
    },
    [balances],
  );

  return (
    <BalanceContext.Provider
      value={{
        balances,
        exchangeRates,
        loading,
        refresh,
        getTokenBalance,
        getTokenUsd,
        getTokenNative,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalances = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalances must be used within a BalanceProvider");
  }
  return context;
};
