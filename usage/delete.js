// node tests/delete.js 123

import axios from "axios";

const userId = process.argv[2];

if (!userId) {
  console.log("Usage: node delete.js <userId>");
  process.exit(1);
}

try {
  const { data } = await axios.delete("http://localhost:3000/delete", {
    data: {
      userId,
    },
  });

  console.log(data);
} catch (err) {
  console.error(err.response?.data || err.message);
}