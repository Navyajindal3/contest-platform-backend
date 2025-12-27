import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const signToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email: normalizedEmail, passwordHash, role: "USER" }
  });

  const token = signToken(user);
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw new Error("Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  const token = signToken(user);
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};
