import { botQueue } from "../src/queue.js";

const jobs = await botQueue.getJobs([
  "waiting",
  "active",
  "delayed",
  "completed",
  "failed",
  "paused",
]);

for (const job of jobs) {
  console.log({
    id: job.id,
    name: job.name,
    state: await job.getState(),
    data: job.data,
  });
}