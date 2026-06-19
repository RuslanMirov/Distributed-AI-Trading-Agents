export default async function decide(state) {
  const { assets, news } = state;
  console.log("assets, news", assets, news)
  const decisions = [];

  for (const signal of news) {
    const held = assets[signal.asset] ?? 0;

    if (signal.action === "sell" && held > 0) {
      decisions.push({ asset: signal.asset, action: "sell", amount: held, reason: signal.reason });
    } else if (signal.action === "buy") {
      decisions.push({ asset: signal.asset, action: "buy", amount: 0.1, reason: signal.reason });
    }
    // nothing => skip
  }

  return { decisions };
}