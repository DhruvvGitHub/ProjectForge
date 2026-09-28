import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma/client.js";
import { signToken, verifyToken } from "../utils/jwt.js";

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true, // Cannot be accessed by client-side JavaScript (prevents XSS attacks)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax" as const, // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// SIGNUP CONTROLLER
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, fullName, email, password, role, universityId, graduationYear } = req.body;
    const userName = name || fullName;

    if (!userName || !email || !password || !universityId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize role: STUDENT or TPO
    const userRole =
      role?.toUpperCase() === "TPO" || role?.toLowerCase() === "faculty" || role?.toLowerCase() === "admin"
        ? "TPO"
        : "STUDENT";

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: userName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
        universityId: Number(universityId),
        graduationYear: graduationYear ? Number(graduationYear) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        universityId: true,
        graduationYear: true,
        createdAt: true,
      },
    });

    // Generate JWT token and attach it as an httpOnly cookie
    const token = signToken({ userId: user.id, role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// LOGIN CONTROLLER
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Optional role validation if provided by client
    if (role) {
      const expectedRole =
        role.toUpperCase() === "TPO" || role.toLowerCase() === "faculty" || role.toLowerCase() === "admin"
          ? "TPO"
          : "STUDENT";
      if (user.role !== expectedRole) {
        return res.status(403).json({ message: `Access denied. Please log in as a ${user.role}` });
      }
    }

    // Generate JWT token and attach it as an httpOnly cookie
    const token = signToken({ userId: user.id, role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        graduationYear: user.graduationYear,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// LOGOUT CONTROLLER
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

// GET CURRENT AUTHENTICATED USER
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        universityId: true,
        graduationYear: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};