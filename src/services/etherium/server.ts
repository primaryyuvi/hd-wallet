// ethWallet.ts
import { ethers } from "ethers";
import { ETH_RPC } from "../../utils/networks.js";
import type { EthNet } from "../../utils/networks.js";
import type { JsonRpcApiProvider } from "ethers";

export function ethProvider(net: EthNet) {
  return new ethers.JsonRpcProvider(ETH_RPC[net]);
}


export async function getEthBalance(
  provider : JsonRpcApiProvider,
  address: string,
) {
  const bal = await provider.getBalance(address);
  return Number(ethers.formatEther(bal));
}

export async function sendEth(
  provider : JsonRpcApiProvider,
  privateKey: string,
  to: string,
  amountEth: number,
) {
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth.toString()),
  });

  await tx.wait();
  return tx.hash;
}

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export async function getErc20Balance(
  provider : JsonRpcApiProvider,
  tokenAddr: string,
  user: string,
) {
  const c = new ethers.Contract(tokenAddr, ERC20_ABI, provider);

  const [bal, dec] = await Promise.all([
    c.balanceOf(user),
    c.decimals()
  ]);

  return Number(ethers.formatUnits(bal, dec));
}
