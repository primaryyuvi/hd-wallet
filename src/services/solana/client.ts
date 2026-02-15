import { Connection } from "@solana/web3.js";
import { SOLANA_RPC } from "../../utils/networks";

class SolanaClient {
  private connection: Connection;

  constructor(rpc: string) {
    this.connection = new Connection(rpc, "confirmed");
  }

  get conn() {
    return this.connection;
  }
}

export const solanaClient = new SolanaClient(
  SOLANA_RPC.devnet
);
