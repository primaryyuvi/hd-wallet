import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";

export function deriveSolanaKeys(
  seed: Uint8Array,
  accountNumber: string
): Keypair {
  const path = `m/44'/501'/${accountNumber}'/0'`;
  const seedBuffer = Buffer.from(seed);
  const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;
  const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
  
  return Keypair.fromSecretKey(keypair.secretKey);
}

export function getSolanaKeypair(privateKey: string): Keypair {
  let keypair: Keypair | null = null;
  try {
    keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
  } catch {
    try {
      keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)));
    } catch {
      try {
        keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
      } catch {
        throw new Error("Invalid Solana private key");
      }
    }
  }
  return keypair;
}