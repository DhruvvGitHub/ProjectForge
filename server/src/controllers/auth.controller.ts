import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../prisma/client.js";
import { signToken } from "../utils/jwt.js";

// Cookie configuration
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: "/",
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: COOKIE_OPTIONS.path,
  });
};

const signupSchema = z.object({
  name: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  universityId: z.number().optional(),
  university: z.union([z.string(), z.number()]).optional(),
  graduationYear: z.number().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid credentials"),
  password: z.string().min(1, "Invalid credentials"),
});

// SIGNUP CONTROLLER
export const signup = async (req: Request, res: Response) => {
  try {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Invalid input";
      return res.status(400).json({ error: errorMsg });
    }

    const { name, fullName, email, password, universityId, university, graduationYear } = parseResult.data;
    const userName = (name || fullName)?.trim();

    if (!userName) {
      return res.status(400).json({ error: "Name is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Resolve university ID
    let resolvedUniId: number | null = universityId ? Number(universityId) : null;
    if (!resolvedUniId && university) {
      const num = Number(university);
      if (!isNaN(num) && num > 0) {
        resolvedUniId = num;
      } else {
        const found = await prisma.university.findFirst({
          where: {
            name: {
              contains: String(university).trim(),
              mode: "insensitive",
            },
          },
        });
        if (found) {
          resolvedUniId = found.id;
        }
      }
    }

    if (!resolvedUniId) {
      const firstUni = await prisma.university.findFirst();
      if (firstUni) resolvedUniId = firstUni.id;
    }

    if (!resolvedUniId) {
      return res.status(400).json({ error: "Please select a valid university" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: userName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "STUDENT",
        universityId: resolvedUniId,
        graduationYear: graduationYear ? Number(graduationYear) : null,
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        university: user.university,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Server error during signup" });
  }
};

// LOGIN CONTROLLER
export const login = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        university: user.university,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
};

// LOGOUT CONTROLLER
export const logout = (_req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.status(204).send();
};

// GET CURRENT AUTHENTICATED USER
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        university: user.university,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};