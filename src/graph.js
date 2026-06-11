import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import fetchNews from "../tools/fetchNews.js";
import fetchPrice from "../tools/fetchPrice.js";
import decide from "../tools/decide.js";

export function createGraph() {
  const State = Annotation.Root({
    price: Annotation(),
    news: Annotation(),
    decision: Annotation(),
    userId: Annotation(),
  });

  return new StateGraph(State)
    .addNode("fetch_price", fetchPrice)
    .addNode("fetch_news", fetchNews)
    .addNode("decide", decide)
    .addEdge(START, "fetch_price")
    .addEdge(START, "fetch_news")
    .addEdge("fetch_price", "decide")
    .addEdge("fetch_news", "decide")
    .addEdge("decide", END)
    .compile();
}