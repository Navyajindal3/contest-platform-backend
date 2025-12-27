import redis from "../config/redis.js";

const leaderboardKey = (contestId) => `leaderboard:${contestId}`;

export const submitScore = async (contestId, userId, score) => {
  await redis.zadd(
    leaderboardKey(contestId),
    Number(score),
    userId
  );
};

export const getTopUsers = async (contestId, limit = 10) => {
  const data = await redis.zrevrange(
    leaderboardKey(contestId),
    0,
    limit - 1,
    "WITHSCORES"
  );

  const leaderboard = [];
  for (let i = 0; i < data.length; i += 2) {
    leaderboard.push({
      userId: data[i],
      score: Number(data[i + 1])
    });
  }

  return leaderboard;
};

export const getUserRank = async (contestId, userId) => {
  const rank = await redis.zrevrank(
    leaderboardKey(contestId),
    userId
  );
  return rank !== null ? rank + 1 : null;
};
