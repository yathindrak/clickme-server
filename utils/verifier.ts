import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ClickMeException } from "./exception";

export const verify = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ClickMeException(errors.array()[0]?.msg, 400);
  }
  return next();
};
