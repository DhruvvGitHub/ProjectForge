import { Router } from "express";
import {
  createSubmission,
  getSubmissionStatus,
  getMySubmissions,
  submissionCallback,
} from "../controllers/submission.controller.js";
import { requireAuth, requireRole } from "../middlewares/requireAuth.js";

const router = Router();

// Student-only submission creation
router.post("/", requireAuth, requireRole(["STUDENT"]), createSubmission);

// List user's submissions
router.get("/mine", requireAuth, getMySubmissions);

// Submission status polling (authenticated)
router.get("/:id", requireAuth, getSubmissionStatus);

// Internal callback from FastAPI analysis service (protected via x-analysis-secret)
router.post("/:id/callback", submissionCallback);

export default router;
