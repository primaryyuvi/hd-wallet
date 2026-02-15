import { ethers } from "ethers";
import { ETH_RPC } from "../../utils/networks";

export const ethProvider =
  new ethers.JsonRpcProvider(ETH_RPC.sepolia);
