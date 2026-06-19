import { getAssets, setAssets } from "../db.js";

// No ethers, no chain. Just mutate balances in Postgres.
export default async function trade(state) {
  const { userId, decisions } = state;
  const assets = await getAssets(userId);
  const results = [];

  for (const d of decisions) {
    const before = assets[d.asset] ?? 0;

    if (d.action === "buy") {
      assets[d.asset] = before + d.amount;
    } else if (d.action === "sell") {
      assets[d.asset] = Math.max(0, before - d.amount);
      if (assets[d.asset] === 0) delete assets[d.asset];
    }

    results.push({
      asset: d.asset,
      action: d.action,
      amount: d.amount,
      before,
      after: assets[d.asset] ?? 0,
      virtual: true,
    });
  }

  await setAssets(userId, assets);
  return { results, decision: results }; // `decision` so worker.js log still works
}