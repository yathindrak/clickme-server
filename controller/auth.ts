import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";

export default class authController {

  static async generateApiKey(req: Request, res: Response, next: NextFunction) {
    // generate API key
    const apikey = nanoid(Number(process.env.API_KEY_LENGTH));
  
    res.json({apikey});
  };
}

module.exports = authController;