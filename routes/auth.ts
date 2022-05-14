import { Router } from "express";
import authController from "../controller/auth";
import * as validator from "../utils/validator";
import * as verifier from "../utils/verifier";

const router = Router();

router.post(
  "/signup",
  validator.signup,
  verifier.verify,
  authController.signUp
);

router.get(
  "/verify/:code",
  authController.verifyEmail
);

router.post("/apikey", authController.generateApiKey);

export default router;
