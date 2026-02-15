import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppScreen, Blockchain, User, Wallet, WalletAccount,SwapData } from '../utils/types';
import { generateNewMnemonic, mnemonicToSeedConversion } from '../services/seed';
import { deriveETHKeys, getEthereumWallet } from '../services/etherium/keys';
import { deriveSolanaKeys,getSolanaKeypair } from '../services/solana/keys';
import bs58 from "bs58"
import { encryptWithPassword, secureSet, secureGet, decryptWithPassword, clearSessionKey } from '../utils/crypto';

interface AuthContextType {
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  user: User | null;
  wallet: Wallet | null;
  selectedAccount: WalletAccount | null;
  isAuthenticated: boolean;
  isUnlocked: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  logout: () => void;
  lock: () => void;
  createNewAccount: (network: 'SOL' | 'ETH') => void;
  selectAccount: (accountId: string) => void;
  importSolanaAccountViaPrivateKey: (privateKey: string, accountIndex: number) => void;
  importEtheriumAccountViaPrivateKey: (privateKey: string, accountIndex: number) => void;
  setSwapData: (data: SwapData | null) => void;
  swapData: SwapData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const STORAGE_KEYS = {
  USER: 'cryptovault_user',
  WALLET: 'cryptovault_wallet',
  IS_AUTHENTICATED: 'cryptovault_authenticated',
  SEED_PHRASE : "seed_phrase"
};


const generateSeedPhrase = (): string => {
   return generateNewMnemonic(true)
};

const generateSolanaWalletAccount = async (
  accountIndex: number
): Promise<WalletAccount> => {
  
  const seed = await secureGet(STORAGE_KEYS.SEED_PHRASE)
  if (!seed) {
    throw Error("No seed phrase found")
  }
   const arraySeed = mnemonicToSeedConversion(seed);
   const newAccount = deriveSolanaKeys(arraySeed,accountIndex.toString())

  return {
    id: `${"SOL".toLowerCase()}-${accountIndex}`,
    name: `Account ${accountIndex + 1}`,
    publicAddress: newAccount.publicKey.toBase58(),
    privateAddress : bs58.encode(newAccount.secretKey),
    blockChainType : "SOL",
  };
};

const generateEthWalletAccount = async (
  accountIndex: number
): Promise<WalletAccount> => {
  
  const seed = await secureGet(STORAGE_KEYS.SEED_PHRASE)
  if (!seed) {
    throw Error("No seed phrase found")
  }
  const arraySeed = mnemonicToSeedConversion(seed);
  const newAccount = deriveETHKeys(arraySeed,accountIndex.toString())

  return {
    id: `${"ETH".toLowerCase()}-${accountIndex}`,
    name: `Account ${accountIndex + 1}`,
    publicAddress: null,
    privateAddress: newAccount.privateKey,
    address : newAccount.address,
    blockChainType : "ETH"
  };
};




const generateWallet = async (): Promise<Wallet> => {
  const accounts: WalletAccount[] = [
   await generateSolanaWalletAccount(0),
    await generateEthWalletAccount(0)
  ];
  console.log(accounts)
  return {
    accounts,
    selectedAccountId: accounts[0].id,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
   const [swapData, setSwapData] = useState<SwapData | null>(null);

  const getInitialAuthState = () => {
    const hasUser = !!localStorage.getItem(STORAGE_KEYS.USER);
    const hasWallet = !!localStorage.getItem(STORAGE_KEYS.WALLET);
    const storedAuth = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
  
    if (!hasUser || !hasWallet) {
      return {
        isAuthenticated: false,
        screen: "onboarding-choice" as AppScreen,
      };
    }
  
    if (storedAuth === "true") {
      return {
        isAuthenticated: true,
        screen: "unlock" as AppScreen,
      };
    }
  
    return {
      isAuthenticated: false,
      screen: "login" as AppScreen,
    };
  };

  
  const initialAuth = getInitialAuthState();
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuth.isAuthenticated
  );
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(
    initialAuth.screen
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const selectedAccount = wallet?.accounts.find(acc => acc.id === wallet.selectedAccountId) || null;

  const signup = async (username: string, password: string): Promise<void> => {
    const newUser: User = {
      username,
      createdAt: Date.now(),
    };
    const encrypted = await encryptWithPassword(newUser, password);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(encrypted));
    const seedPhrase = localStorage.getItem(STORAGE_KEYS.SEED_PHRASE) ?? generateSeedPhrase();
    await secureSet(STORAGE_KEYS.SEED_PHRASE, seedPhrase);
    const newWallet = await generateWallet();

    await secureSet(STORAGE_KEYS.WALLET, newWallet);
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");

    setUser(newUser);
    setWallet(newWallet);
    setIsAuthenticated(true);
    setIsUnlocked(true);
    setCurrentScreen('home');
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (!raw) return false;
    
      try {
        const encryptedUser = JSON.parse(raw);
        const user: User = await decryptWithPassword(
          encryptedUser,
          password
        );
    
        if (user.username !== username) return false;
    
        const wallet = await secureGet(STORAGE_KEYS.WALLET);
    
        setUser(user);
        setWallet(wallet);
        setIsAuthenticated(true);
        setIsUnlocked(true);
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");
        setCurrentScreen("home");
    
        return true;
      } catch {
        return false;
      }
  };

  const unlock = async (password: string): Promise<boolean> => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (!raw) return false;
    
      try {
        const encryptedUser = JSON.parse(raw);
        await decryptWithPassword(encryptedUser, password);
    
        const wwallet : Wallet = await secureGet(STORAGE_KEYS.WALLET);
        console.log("wwallet",wwallet)
    
        setWallet(wwallet);
        setIsUnlocked(true);
        selectAccount(wwallet.selectedAccountId)
        setCurrentScreen("home");
    
        return true;
      } catch (err) {
        console.log(err)
        return false;
      }
  };

  const logout = () => {
    clearSessionKey();
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    setIsAuthenticated(false);
    setIsUnlocked(false);
    setUser(null);
    setWallet(null);
    setCurrentScreen("onboarding-choice");
  };


  const lock = () => {
    clearSessionKey();
    setIsUnlocked(false);
    setCurrentScreen("unlock");
  };

  const createNewAccount = async (blockChainType: Blockchain) => {
    if (!wallet) return;

    const networkAccounts = wallet.accounts.filter(acc => acc.blockChainType === blockChainType);
    const nextIndex = networkAccounts.length;
    const newAccount = blockChainType == "ETH" ? await generateEthWalletAccount(nextIndex) : await generateSolanaWalletAccount(nextIndex)

    const updatedWallet: Wallet = {
      ...wallet,
      accounts: [...wallet.accounts, newAccount],
      selectedAccountId: newAccount.id,
    };

    setWallet(updatedWallet);
    await secureSet(STORAGE_KEYS.WALLET, updatedWallet);
  };

  const selectAccount = async (accountId: string) => {
    if (!wallet) return;

    const updatedWallet: Wallet = {
      ...wallet,
      selectedAccountId: accountId,
    };

    setWallet(updatedWallet);
    await secureSet(STORAGE_KEYS.WALLET, updatedWallet);
  };
  
  const importSolanaAccountViaPrivateKey = async (privateKey: string, accountIndex: number) => {
    if (!wallet) return;
    if(wallet.accounts.some(account =>
      account.blockChainType === "SOL" &&
      account.privateAddress === privateKey
    )) {
      console.log("Already present")
      return 
    } 
    const newKeyPair = getSolanaKeypair(privateKey);
    const newAccount : WalletAccount =  {
      id: `${"SOL".toLowerCase()}-${accountIndex}`,
      name: `Account ${accountIndex + 1}`,
      publicAddress: newKeyPair.publicKey.toBase58(),
      privateAddress : bs58.encode(newKeyPair.secretKey),
      blockChainType : "SOL",
    };
    
    const updatedWallet: Wallet = {
      ...wallet,
      accounts: [...wallet.accounts, newAccount],
      selectedAccountId: newAccount.id,
    };
  
    setWallet(updatedWallet);
    await secureSet(STORAGE_KEYS.WALLET,updatedWallet);
  }
  
  
  const importEtheriumAccountViaPrivateKey = async (privateKey: string, accountIndex: number) => {
    if (!wallet) return;
    if(wallet.accounts.some(account =>
      account.blockChainType === "ETH" &&
      account.privateAddress === privateKey
    )) {
      console.log("Already present")
      return 
    } 
    const newWallet = getEthereumWallet(privateKey)
    const newAccount : WalletAccount =  {
      id: `${"ETH".toLowerCase()}-${accountIndex}`,
      name: `Account ${accountIndex + 1}`,
      publicAddress: null,
      privateAddress: newWallet.privateKey,
      address : newWallet.address,
      blockChainType : "ETH"
    };
    
    const updatedWallet: Wallet = {
      ...wallet,
      accounts: [...wallet.accounts, newAccount],
      selectedAccountId: newAccount.id,
    };
  
    setWallet(updatedWallet);
    await secureSet(STORAGE_KEYS.WALLET, updatedWallet);
  }

  

  return (
    <AuthContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        wallet,
        selectedAccount,
        isAuthenticated,
        isUnlocked,
        login,
        signup,
        unlock,
        logout,
        lock,
        createNewAccount,
        selectAccount,
        importEtheriumAccountViaPrivateKey,
        importSolanaAccountViaPrivateKey,
        swapData,
        setSwapData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};