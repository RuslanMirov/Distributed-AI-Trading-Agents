// implement trade logic here

async function decide(state) {
  if (state.news.includes("bullish")) {
    return { decision: "BUY" };
  }
  return { decision: "HOLD" };
}

export default decide