import { Router } from "express";
import authController from "../controller/auth";

const router = Router();

router.post(
    "/apikey",
    authController.generateApiKey
);

export default router;