import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import assetRoutes from "./asset.routes.js";
import liabilityRoutes from "./liability.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/assets", assetRoutes);
router.use("/liabilities", liabilityRoutes);

export default router;
