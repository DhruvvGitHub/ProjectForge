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
  badge: z.enum(["ELITE", "GOLD", "SILVER", "BRONZE", "NEEDS_WORK"]).optional(),
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

// GET /api/submissions/leaderboard (University-wise Student Leaderboard)
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user's university
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { universityId: true, university: { select: { id: true, name: true } } },
    });

    if (!currentUser?.universityId) {
      return res.status(400).json({ error: "User is not linked to any university" });
    }

    // Query highest scored completed submission per student for this university
    const submissions = await prisma.submission.findMany({
      where: {
        status: "COMPLETED",
        score: { not: null },
        user: {
          universityId: currentUser.universityId,
          role: "STUDENT",
        },
      },
      orderBy: { score: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            graduationYear: true,
          },
        },
      },
      take: 50,
    });

    // Group to keep best submission per student
    const seenUsers = new Set<number>();
    const leaderboard = [];

    for (const sub of submissions) {
      if (!seenUsers.has(sub.userId)) {
        seenUsers.add(sub.userId);
        leaderboard.push({
          rank: leaderboard.length + 1,
          submissionId: sub.id,
          studentName: sub.user.name,
          studentId: sub.user.id,
          graduationYear: sub.user.graduationYear,
          repoUrl: sub.repoUrl,
          score: sub.score,
          badge: sub.badge,
          createdAt: sub.createdAt,
        });
      }
    }

    return res.status(200).json({
      university: currentUser.university,
      leaderboard,
    });
  } catch (error) {
    console.error("getLeaderboard error:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// GET /api/submissions/tpo/analytics (TPO University-wide Project Audit Overview)
export const getTpoDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tpoUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        university: {
          select: { id: true, name: true, state: true, district: true },
        },
      },
    });

    if (!tpoUser || tpoUser.role !== "TPO") {
      return res.status(403).json({ error: "Forbidden: TPO access required" });
    }

    // All student submissions from this university
    const submissions = await prisma.submission.findMany({
      where: {
        user: {
          universityId: tpoUser.universityId,
          role: "STUDENT",
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            graduationYear: true,
          },
        },
      },
    });

    // Compute key TPO KPIs
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter((s) => s.status === "COMPLETED");
    const avgScore =
      completedSubmissions.length > 0
        ? Math.round(
            completedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) /
              completedSubmissions.length
          )
        : 0;

    // Badges distribution
    const badgeDistribution = {
      GOLD: submissions.filter((s) => s.badge === "GOLD").length,
      SILVER: submissions.filter((s) => s.badge === "SILVER").length,
      BRONZE: submissions.filter((s) => s.badge === "BRONZE").length,
      NEEDS_WORK: submissions.filter((s) => s.badge === "NEEDS_WORK").length,
    };

    // Unique students audited
    const uniqueStudents = new Set(submissions.map((s) => s.userId)).size;

    return res.status(200).json({
      university: tpoUser.university,
      stats: {
        totalSubmissions,
        completedAudits: completedSubmissions.length,
        uniqueStudents,
        averageScore: avgScore,
        badgeDistribution,
      },
      submissions: submissions.map((s) => ({
        id: s.id,
        repoUrl: s.repoUrl,
        status: s.status,
        score: s.score,
        badge: s.badge,
        createdAt: s.createdAt,
        student: s.user,
      })),
    });
  } catch (error) {
    console.error("getTpoDashboardAnalytics error:", error);
    return res.status(500).json({ error: "Failed to fetch TPO analytics" });
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
