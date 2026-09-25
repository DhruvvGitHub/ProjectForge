import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Autocomplete universities endpoint
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

    res.json(universities);
  } catch (error) {
    console.error("Error searching universities:", error);
    res.status(500).json({ error: "Failed to fetch universities" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
