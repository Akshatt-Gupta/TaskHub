import express from "express";
import authRoutes from "./auth.js";

import workspaceRoutes from "./workspace.js";

import ProjectRoutes from "./project.js"

import TaskRoutes from "./task.js"
import UserRoutes from "./user.js"


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects",ProjectRoutes);
router.use("/tasks",TaskRoutes);
router.use("/users",UserRoutes)



export default router;