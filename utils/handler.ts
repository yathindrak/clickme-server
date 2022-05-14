import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ClickMeException } from "./exception";

export const error: ErrorRequestHandler = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ClickMeException) {
      return res.status(error?.status || 500).json({ error: error?.message });
    }
  
    return res.status(500).json({ error: "Internal Server Error!" });
  };