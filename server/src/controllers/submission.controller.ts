import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";

const GITHUB_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(\/|\.git)?$/;

const createSubmissionSchema = z.object({
  repoUrl: z
    .string()
    .url("Must be a valid URL")
    .regex(GITHUB_REPO_REGEX, "Must be a valid public GitHub repository URL (e.g., https://github.com/user/repo)"),
});

const callbackSchema = z.object({
  status: z.enum(["COMPLETED", "FAILED"]),
  score: z.number().int().min(0).max(100).optional(),
  badge: z.enum(["GOLD", "SILVER", "BRONZE", "NEEDS_WORK"]).optional(),
  metrics: z.record(z.string(), z.any()).optional(),
  feedback: z.record(z.string(), z.any()).optional(),
  errorMessage: z.string().optional(),
});

// POST /api/submissions
export const createSubmission = async (req: Request, res: Response) => {
  try {
    const parseResult = createSubmissionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues[0]?.message || "Invalid repository URL",
      });
    }

    const { repoUrl } = parseResult.data;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Save as PENDING
    const submission = await prisma.submission.create({
      data: {
        repoUrl: repoUrl.trim(),
        userId,
        status: "PENDING",
      },
    });

    // Fire async trigger to FastAPI analyzer service in the background (fire-and-forget)
    const analyzerUrl = process.env.ANALYZER_URL || "http://localhost:8000";
    const callbackSecret = process.env.ANALYSIS_SECRET || "projforge_dev_secret_key";
    const backendCallbackUrl = `${process.env.BACKEND_INTERNAL_URL || "http://localhost:5000"}/api/submissions/${submission.id}/callback`;

    fetch(`${analyzerUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId: submission.id,
        repoUrl: submission.repoUrl,
        callbackUrl: backendCallbackUrl,
        callbackSecret,
      }),
    }).catch((err) => {
      console.warn(`[FastAPI Analyzer] Async trigger notice for submission ${submission.id}:`, err.message);
    });

    return res.status(201).json({
      message: "Submission received and queued for analysis",
      submission: {
        id: submission.id,
        repoUrl: submission.repoUrl,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("createSubmission error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/submissions/:id
export const getSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid submission ID" });
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            universityId: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    return res.status(200).json({ submission });
  } catch (error) {
    console.error("getSubmissionStatus error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/submissions (User's own submissions)
export const getMySubmissions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const submissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ submissions });
  } catch (error) {
    console.error("getMySubmissions error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/submissions/:id/callback
export const submissionCallback = async (req: Request, res: Response) => {
  try {
    const expectedSecret = process.env.ANALYSIS_SECRET || "projforge_dev_secret_key";
    const authHeader = req.headers["x-analysis-secret"];

    if (authHeader !== expectedSecret) {
      return res.status(403).json({ error: "Forbidden: invalid analysis secret" });
    }

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid submission ID" });
    }

    const parseResult = callbackSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues[0]?.message || "Invalid payload",
      });
    }

    const { status, score, badge, metrics, feedback, errorMessage } = parseResult.data;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status,
        score: score ?? null,
        badge: badge ?? null,
        metricsJson: metrics ? (metrics as any) : undefined,
        feedbackJson: feedback ? (feedback as any) : undefined,
        errorMessage: errorMessage ?? null,
      },
    });

    return res.status(200).json({ success: true, submissionId: updated.id });
  } catch (error) {
    console.error("submissionCallback error:", error);
    return res.status(500).json({ error: "Failed to process analysis callback" });
  }
};
