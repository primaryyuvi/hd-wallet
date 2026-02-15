import type { PriceMap } from "../utils/types";

let cache: PriceMap | null = null;
let lastFetch = 0;

const CACHE_MS = 60_000;

export async function getUsdPrices(): Promise<PriceMap> {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_MS) {
    return cache;
  }

  const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum,jupiter-exchange-solana,usd-coin,tether&vs_currencies=usd"
  );

  if (!r.ok) throw new Error("price fetch failed");

  const j = await r.json();

  cache = {
      SOL: j.solana.usd,
      ETH: j.ethereum.usd,
      JUP: j["jupiter-exchange-solana"].usd,
      USDC: j["usd-coin"].usd,
      USDT: j.tether.usd,
    };

  lastFetch = now;
  return cache;
}
