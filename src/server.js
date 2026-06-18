import express from "express";
import { botQueue } from "./queue.js";
import { initDB, addAssets, setAssets, getAssets } from "./db.js";

const app = express();
app.use(express.json());

await initDB(); 

/** ADD / SET VIRTUAL ASSETS */
app.post("/assets", async (req, res) => {
  const { userId, assets, mode = "add" } = req.body;
  if (!userId || !assets) {
    return res.status(400).json({ ok: false, error: "userId and assets required" });
  }
  const row = mode === "set"
    ? await setAssets(userId, assets)
    : await addAssets(userId, assets);
  res.json({ ok: true, userId, assets: row.assets });
});

/** GET VIRTUAL ASSETS */
app.get("/assets/:userId", async (req, res) => {
  const assets = await getAssets(req.params.userId);
  res.json({ ok: true, userId: req.params.userId, assets });
});

/** START BOT */
app.post("/run", async (req, res) => {
  const { userId } = req.body;
  await botQueue.add("tick", { userId, delay: 5000 }, { removeOnComplete: true });
  res.json({ ok: true, status: "started", userId });
});

/** STOP BOT */
app.post("/stop", async (req, res) => {
  const { userId } = req.body;
  const jobs = await botQueue.getJobs(["waiting", "delayed", "active", "prioritized"]);
  for (const job of jobs) {
    if (job.data.userId === userId) await job.remove();
  }
  res.json({ ok: true, status: "stopped", userId });
});

/** DELETE BOT */
app.delete("/delete", async (req, res) => {
  const { userId } = req.body;
  const jobs = await botQueue.getJobs(["waiting", "delayed", "active"]);
  for (const job of jobs) {
    if (job.data.userId === userId) await job.remove();
  }
  res.json({ ok: true, status: "deleted", userId });
});

app.listen(3000, () => console.log("API running on :3000"));