export const SOLANA_RPC = {
  devnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
  helius : "https://mainnet.helius-rpc.com/?api-key=<Your Api Key>"
};

export const ETH_RPC = {
  sepolia: "https://sepolia.infura.io/v3/58747c55d3804ddb9c02930fe9b57b9f",
  mainnet: "https://rpc.ankr.com/eth",
};

export type SolanaNet = keyof typeof SOLANA_RPC;
export type EthNet = keyof typeof ETH_RPC;
