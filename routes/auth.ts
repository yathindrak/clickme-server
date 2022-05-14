import { Router } from "express";
import authController from "../controller/auth";
import * as authUtils from "../utils/auth";
import * as validator from "../utils/validator";
import * as verifier from "../utils/verifier";
import asyncHandler from "express-async-handler";

const router = Router();

router.post(
  "/signup",
  validator.signup,
  verifier.verify,
  authController.signUp
);

router.get("/verify/:code", authController.verifyEmail);

router.post("/apikey", asyncHandler(authUtils.verifyToken), authController.generateApiKey);

export default router;
