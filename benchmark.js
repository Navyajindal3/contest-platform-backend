import autocannon from "autocannon";

autocannon({
  url: "http://localhost:3000/api/leaderboard/submit",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    userId: "benchmark_user",
    score: Math.floor(Math.random() * 1000),
    contestId: "test"
  }),
  connections: 100,
  duration: 10
}, console.log);
