import OpenAI from "openai";
import 'dotenv/config'
import { getAssets } from "../db.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function fetchNews(state) {
  const assets = await getAssets(state.userId);
  const symbols = Object.keys(assets ?? {});
  console.log("symbols", symbols, state)
  if (symbols.length === 0) return { news: [] };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a crypto analyst. For each asset find current news, then return buy, sell, or nothing. " +
          'Respond ONLY as JSON: {"news":[{"asset":"ETH","action":"buy|sell|nothing","reason":"..."}]}',
      },
      { role: "user", content: `Assets: ${symbols.join(", ")}` },
    ],
  });

  const parsed = JSON.parse(res.choices[0].message.content);
  return { news: parsed.news ?? [] };
}