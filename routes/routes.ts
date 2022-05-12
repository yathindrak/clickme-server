import { Router } from "express";

import auth from "./auth";
import health from "./health";

const router = Router();

router.use("/auth", auth);
router.use("/health", health);

export default router;
