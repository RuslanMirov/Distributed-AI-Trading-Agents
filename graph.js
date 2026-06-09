import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import fetchNews from './tools/fetchNews.js'
import fetchPrice from './tools/fetchPrice.js'
import decide from './tools/decide.js'

const State = Annotation.Root({
  price: Annotation(),
  news: Annotation(),
  decision: Annotation(),
});


// граф: price и news выполняются параллельно, decide ждёт оба
const graph = new StateGraph(State)
  // добавить шаг/функцию
  .addNode("fetch_price", fetchPrice)
  .addNode("fetch_news", fetchNews)
  .addNode("decide", decide)

  // указать, куда переходить после выполнения шага.
  .addEdge(START, "fetch_price")
  .addEdge(START, "fetch_news")
  .addEdge("fetch_price", "decide")
  .addEdge("fetch_news", "decide")
  .addEdge("decide", END)
  .compile();


setInterval(async () => {
  const result = await graph.invoke({});
  console.log(result.decision);
}, 5000); // каждые 5 секунд