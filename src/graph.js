import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import fetchNews from "./tools/fetchNews.js";
import decide from "./tools/decide.js";
import trade from "./tools/trade.js";

export function createGraph() {
  const State = Annotation.Root({
    userId: Annotation(),
    news: Annotation(),
    decisions: Annotation(),
    results: Annotation(),
    decision: Annotation(),
  });

  return new StateGraph(State)
    .addNode("fetch_news", fetchNews)
    .addNode("decide", decide)
    .addNode("trade", trade)

    .addEdge(START, "fetch_news")
    
    .addEdge("fetch_news", "decide")
    .addEdge("decide", "trade")
    .addEdge("trade", END)
    .compile();
}