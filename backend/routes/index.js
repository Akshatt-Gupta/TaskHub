import express from "express";
import authRoutes from "./auth.js";

import workspaceRoutes from "./workspace.js";

import ProjectRoutes from "./project.js"


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects",ProjectRoutes)



export default router;