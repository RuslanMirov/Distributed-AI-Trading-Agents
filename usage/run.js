// node tests/run.js 123

import axios from "axios";

const userId = process.argv[2];

if (!userId) {
  console.log("Usage: node start.js <userId>");
  process.exit(1);
}

try {
  const { data } = await axios.post("http://localhost:3000/run", {
    userId,
  });

  console.log(data);
} catch (err) {
  console.error(
    err.response?.data || err.message
  );
}