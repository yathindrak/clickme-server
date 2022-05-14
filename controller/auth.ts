import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import * as userService from "../database/services/userService";
import { ClickMeException } from "../utils/exception";
import { IUser } from "../database/models/user";
import { sendVerificationEmail } from "../email/sender";
import { generateToken } from "../utils/auth";

export default class authController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    let user = (req as any)?.user as IUser;
    if (!user) {
      const body = req.body;
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);

      const payload = {
        name: body.name,
        email: body.email,
        password,
        verified: false,
        verificationCode: uuidv4(),
        verificationExpiredAt: new Date(new Date().getTime() + 60*60*1000)
      };

      try {
        user = await userService.create(payload);
      } catch (error) {
        throw new ClickMeException("User registration went wrong");
      }
    }

    sendVerificationEmail(user);

    return res.status(201).send({ message: "Verification link has been sent" });
  }

  static async generateApiKey(req: Request, res: Response, next: NextFunction) {
    // generate API key
    const apikey = nanoid(Number(process.env.API_KEY_LENGTH));

    // await service.update(id, payload);

    res.json({ apikey });
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    if (!req.params.code) {
      throw new ClickMeException("Email verification code is invalid");
    }

    let user = null;

    try {
      user = await userService.getByEmailVerificationCode(req.params.code);
    } catch (error) {
      throw new ClickMeException("Invalid verification code", 400);
    }

    if(user && user.verificationExpiredAt &&  user.verificationExpiredAt >= new Date()) {
      user.verified = true;
      user.verificationCode = undefined;
      user.verificationExpiredAt = undefined;
    } else {
      throw new ClickMeException("Invalid verification code", 400);
    }

    // update user
    try {
      user = await userService.update(user?.id, user);
    } catch (error) {
      throw new ClickMeException("User registration went wrong");
    }

    const token = generateToken(user);

    res.status(200).json({ accessToken: token });
  }
}

module.exports = authController;
