import { getAssets } from "../src/db.js";

export default async function fetchAssets(state) {
  const assets = await getAssets(state.userId);
  return { assets }; // { ETH: 1.5, USDC: 200, ... }
}