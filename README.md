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
```

# run 

```
node src/server.js   # API
node src/worker.js   # worker 
```

## TODO

```
Implement trade tools
It can be any tools dex api or cexs web3
```