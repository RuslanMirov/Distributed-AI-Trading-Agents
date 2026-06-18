# 🚀 LangGraph + BullMQ Bot System

A scalable multi-user bot system using **LangGraph**, **BullMQ**, and **Redis**.

---

## 🧠 Idea

Each user bot runs as a **queue job** instead of `setInterval`.  
Jobs execute a LangGraph workflow and re-schedule themselves for continuous operation.

---

## ⚙️ Architecture

---

## 📦 Core parts

- **BullMQ Queue** – stores bot jobs in Redis  
- **Worker** – processes jobs and runs LangGraph  
- **LangGraph** – AI workflow (price, news, decision)
- **PostgreSQL** - DB for virtual portfolio, you can replace it with your tools

---

## 🚀 API

- `POST /run` – start bot  
- `POST /stop` – stop bot  
- `DELETE /delete` – remove bot  

---

## ⚡ Worker

```js
concurrency: 10
```

# .env

```
DB_USER=
DB_PASS=
DB_NAME=
OPENAI_API_KEY=
AGENT_INTERVAL=10800000 # 3 hours
```

# run 

```
node src/server.js   # API
node src/worker.js   # worker 
```

## Virtual portfolio

```
Current show case use virtual portfolio, you can re-write it with dex or cexs implementation
```

# curl 

```
# 1. give a user some virtual holdings
curl -X POST localhost:3000/assets -H "Content-Type: application/json" \
  -d '{"userId":"user123","assets":{"ETH":2,"USDC":500}}'

# 2. start the bot loop
curl -X POST localhost:3000/run -H "Content-Type: application/json" \
  -d '{"userId":"user123"}'

# 3. watch worker logs tick every 5s, balances mutate in DB

# 4. check holdings
curl localhost:3000/assets/user123

# 5. stop
curl -X POST localhost:3000/stop -H "Content-Type: application/json" \
  -d '{"userId":"user123"}'
```