import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import { prisma } from "./src/prisma/client.js";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const FRONTEND_URLS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: FRONTEND_URLS,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Universities Autocomplete API
app.get("/api/universities", async (req, res) => {
  try {
    const rawQuery = (req.query.q || req.query.query || req.query.search || "") as string;
    const query = rawQuery.trim();

    if (!query) {
      return res.json([]);
    }

    const universities = await prisma.university.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        state: true,
        district: true,
      },
    });

    return res.json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ error: "Failed to fetch universities" });
  }
});

export default app;