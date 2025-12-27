import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request
    req.user = { id: payload.userId, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
  next();
};
