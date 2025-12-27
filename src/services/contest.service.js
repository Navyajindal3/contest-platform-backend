import redis from "../config/redis.js";

const contestKey = (contestId) => `contest:${contestId}`;
const leaderboardKey = (contestId) => `leaderboard:${contestId}`;

export const createContest = async (contestId, durationSec = 3600) => {
  const exists = await redis.exists(contestKey(contestId));
  if (exists) {
    throw new Error("Contest already exists");
  }

  await redis.hset(contestKey(contestId), {
    status: "ACTIVE",
    createdAt: Date.now()
  });

  // Auto-expire contest + leaderboard
  await redis.expire(contestKey(contestId), durationSec);
  await redis.expire(leaderboardKey(contestId), durationSec);
};

export const isContestActive = async (contestId) => {
  const status = await redis.hget(contestKey(contestId), "status");
  return status === "ACTIVE";
};

export const endContest = async (contestId) => {
  await redis.hset(contestKey(contestId), { status: "ENDED" });
};
