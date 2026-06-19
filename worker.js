import { Worker } from "bullmq";
import { connection } from "./src/queue.js";
import { createGraph } from "./src/graph.js";
import { botQueue } from "./src/queue.js";
import 'dotenv/config'

const graph = createGraph();
const delayInterval = process.env.AGENT_INTERVAL | 10800000 // 3 hours

const worker = new Worker(
  "bot-queue",
  async (job) => {
    const { userId, delay = process.env.AGENT_INTERVAL } = job.data;

    console.log(`⚙️ Running bot for user: ${userId}`);

    const result = await graph.invoke({
      userId,
    });

    console.log(`📊 [${userId}] decision:`, result.decision);

    // instead of setInterval
    await botQueue.add(
      "tick",
      { userId, delay },
      {
        delay, // pause betwwen calls
        removeOnComplete: true,
        removeOnFail: 100,
      }
    );

    return result;
  },
  {
    connection,
    concurrency: 10, // count of workers
  }
);