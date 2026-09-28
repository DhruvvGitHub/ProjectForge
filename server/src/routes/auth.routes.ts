import { Router } from "express";
import { login, signup, logout, getMe } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

export default router;