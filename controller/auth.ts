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
        verificationExpiredAt: new Date(new Date().getTime() + 60 * 60 * 1000)
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

  /**
   * Generate and Regenerate API key
   * @param req
   * @param res
   * @param next
   */
  static async generateApiKey(req: Request, res: Response, next: NextFunction) {
    // generate API key
    const apikey = nanoid(Number(process.env.API_KEY_LENGTH));

    try {
      await userService.update((req as any).user?.id, {apikey});
    } catch (error) {
      throw new ClickMeException("User registration went wrong");
    }

    console.log("token generated")

    res.status(200).json({ apikey });
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    if (!req.params.code) {
      throw new ClickMeException("Email verification code is invalid");
    }

    let user = null;

    try {
      user = await userService.getByEmailVerificationCode(req.params.code);
    } catch (error) {
      console.log(error);
      throw new ClickMeException("Invalid verification code", 400);
    }

    let updatePayload = null;

    if (
      user &&
      user.verificationExpiredAt &&
      user.verificationExpiredAt >= new Date()
    ) {
      updatePayload = {"verified": true, "verificationCode": null, "verificationExpiredAt": null}
      user.verified = true;
      user.verificationExpiredAt = undefined;
      user.verificationCode = undefined;
    } else {
      throw new ClickMeException("Invalid verification code", 400);
    }

    // update user
    try {
      await userService.update(user?.id, updatePayload);
    } catch (error) {
      throw new ClickMeException("Email verification failed");
    }

    const token = generateToken(user);

    res.status(200).json({ accessToken: token });
  }
}

module.exports = authController;
