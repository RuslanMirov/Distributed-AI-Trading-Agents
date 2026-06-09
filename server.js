import express from "express";
import { botQueue } from "./queue.js";

const app = express();
app.use(express.json());

/**
 * ▶ START BOT
 */
app.post("/run", async (req, res) => {
  const { userId } = req.body;

  await botQueue.add(
    "tick",
    {
      userId,
      delay: 5000,
    },
    {
      removeOnComplete: true,
    }
  );

  res.json({
    ok: true,
    status: "started",
    userId,
  });
});

/**
 * ⛔ STOP BOT
 */
app.post("/stop", async (req, res) => {
  const { userId } = req.body;

  const jobs = await botQueue.getJobs([
    "waiting",
    "delayed",
    "active",
    "prioritized",
  ]);

  for (const job of jobs) {
    if (job.data.userId === userId) {
      await job.remove();
    }
  }

  res.json({
    ok: true,
    status: "stopped",
    userId,
  });
});

/**
 * 🧹 DELETE BOT 
 */
app.delete("/delete", async (req, res) => {
  const { userId } = req.body;

  const jobs = await botQueue.getJobs([
    "waiting",
    "delayed",
    "active",
  ]);

  for (const job of jobs) {
    if (job.data.userId === userId) {
      await job.remove();
    }
  }

  res.json({
    ok: true,
    status: "deleted",
    userId,
  });
});

app.listen(3000, () => {
  console.log("API running on :3000");
});