// export interface Wallet {
//   id: number;
//   name: string;
//   shortAddr: string;
//   fullAddr: string;
//   path: string;
//   balance: number;
//   color: string;
// }

import { Keypair } from "@solana/web3.js";
export type Blockchain = 'SOL' | 'ETH';
export type KeyPair = Keypair;
import * as assets from "../assets"

export interface User {
  username: string;
  createdAt: number;
}

export interface Wallet {
  accounts: WalletAccount[];
  selectedAccountId: string;
}
export interface WalletAccount {
  id : string,
  publicAddress: string| null;
  privateAddress: string | null
  address? : string
  blockChainType: Blockchain
  name: string,
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  icon: string;
  color: string;
  usdValue: string;
  change: string;
}

export type AppScreen = 
  | 'onboarding-choice'
  | 'signup'
  | 'signup-import'
  | 'unlock'
  | 'home'
  | 'recovery'
  | 'send'
  | 'swap-review'
  | 'settings'
  | 'import-private-key'
  | 'import-seed'
  | 'receive-token'
  | 'view-private-key';

export interface AppState {
  currentScreen: AppScreen;
  isAuthenticated: boolean;
  isUnlocked: boolean;
  user: User | null;
  wallet: Wallet | null;
}

export type PriceMap = {
  SOL: number;
  ETH: number;
  USDC: number;
  USDT: number;
  JUP: number
};

export type BalanceState = {
  native: number | null;
  usd: number | null;
  loading: boolean;
};


export const TOKEN_MINTS = {
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  SOL : "So11111111111111111111111111111111111111112"
};

export interface SwapData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  fromUsdValue: string;
  toUsdValue: string;
}

export interface TokenBalance {
  native: number;
  usd: number;
}

export interface AllBalances {
  SOL: TokenBalance | null;
  ETH: TokenBalance | null;
  USDC: TokenBalance | null;
  USDT: TokenBalance | null;
  JUP: TokenBalance | null;
}

export const token_assets = {
  USDC: assets.usdc,
  USDT: assets.usdt,
  JUP: assets.jup,
  SOL: assets.sol,
  ETH: assets.eth
}
