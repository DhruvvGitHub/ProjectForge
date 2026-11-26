import { Router } from "express";
import {
  createSubmission,
  getSubmissionStatus,
  getMySubmissions,
  getLeaderboard,
  getTpoDashboardAnalytics,
  submissionCallback,
} from "../controllers/submission.controller.js";
import { requireAuth, requireRole } from "../middlewares/requireAuth.js";

const router = Router();

// Student-only submission creation
router.post("/", requireAuth, requireRole(["STUDENT"]), createSubmission);

// List user's submissions
router.get("/mine", requireAuth, getMySubmissions);

// University-wise Leaderboard
router.get("/leaderboard", requireAuth, getLeaderboard);

// TPO Dashboard Analytics (Protected for TPO role only)
router.get("/tpo/dashboard", requireAuth, requireRole(["TPO"]), getTpoDashboardAnalytics);

// Submission status polling (authenticated)
router.get("/:id", requireAuth, getSubmissionStatus);

// Internal callback from FastAPI analysis service (protected via x-analysis-secret)
router.post("/:id/callback", submissionCallback);

export default router;
