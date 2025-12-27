import redis from "../config/redis.js";

// options: { windowSec, maxRequests, keyPrefix }
export const rateLimiter = ({ windowSec = 10, maxRequests = 10, keyPrefix = "rate" }) => {
  return async (req, res, next) => {
    try {
      // Use userId if available, otherwise fallback to IP
      const identifier = req.body.userId || req.ip;
      const key = `${keyPrefix}:${identifier}`;

      // Increment counter atomically
      const requests = await redis.incr(key);

      if (requests === 1) {
        // First request, set TTL
        await redis.expire(key, windowSec);
      }

      if (requests > maxRequests) {
        return res.status(429).json({ error: `Rate limit exceeded. Max ${maxRequests} requests per ${windowSec} seconds.` });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next();
    }
  };
};
