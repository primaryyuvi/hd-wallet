import { HDNodeWallet, Wallet } from "ethers";


export function deriveETHKeys(
  seed: Uint8Array,
  accountNumber: string
) : Wallet {
 
  const path = `m/44'/60'/${accountNumber}'/0'`;
  const seedBuffer = Buffer.from(seed);
  const hdNode = HDNodeWallet.fromSeed(seedBuffer);
  const child = hdNode.derivePath(path);
  return new Wallet(child.privateKey)
}

export function getEthereumWallet(privateKey: string): Wallet {
  let wallet: Wallet;
  try {
    wallet = new Wallet(privateKey);
  } catch {
    throw new Error("Invalid Ethereum private key");
  }
  return wallet;
}


export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}