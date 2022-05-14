import JWT from "jsonwebtoken";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifiedCallback
} from "passport-jwt";
import { Strategy as LocalStratergy } from "passport-local";
import { IUser } from "../database/models/user";
import { ClickMeException } from "./exception";
import * as userService from "../database/services/userService";
import { HeaderAPIKeyStrategy } from "@t-om/passport-headerapikey";

export const initPassport = () => {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.JWT_SECRET
  };

  passport.use(
    new JwtStrategy(
      jwtOptions,
      async (payload: any, done: VerifiedCallback) => {
        let user: IUser = {} as IUser;
        try {
          try {
            user = await userService.getByEmail(payload.sub);
          } catch (error) {
            throw new ClickMeException("Invalid user data");
          }

          if (!user?.id) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new HeaderAPIKeyStrategy(
      {
        header: "Authorization",
        prefix: "Apikey "
      },
      false,
      async (apikey, done) => {
        let user = null;

        try {
          user = await userService.getByApiKey(apikey);
          console.log(user);
        } catch (error) {
          console.log(error);
          return done(error, null);
        }

        if (!user) {
          console.log("no user");
          return done(null, false);
        }
        return done(null, user);
      }
    )
  );

  const localOptions = {
    usernameField: "email"
  };

  passport.use(
    new LocalStratergy(localOptions, async (email, password, done) => {
      let user: IUser = {} as IUser;
      try {
        user = await userService.getByEmail(email);
      } catch (error) {
        return done(error);
      }

      if (!user?.id) {
        return done(null, false);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    })
  );
};

export const generateToken = (user: IUser) => {
  const currentDate = new Date();
  const NUMBER_OF_DAYS_TO_EXPIRY = 3;
  return JWT.sign(
    {
      iss: "ClickMe",
      sub: user.email,
      iat: parseInt((currentDate.getTime() / 1000).toFixed(0)),
      exp: parseInt(
        (
          currentDate.setDate(
            currentDate.getDate() + NUMBER_OF_DAYS_TO_EXPIRY
          ) / 1000
        ).toFixed(0)
      )
    } as Record<string, any>,
    process.env.JWT_SECRET ?? ""
  );
};

export const verifyBasicAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", (err, user: IUser) => {
    if (err) return next(err);

    if (!user?.id) {
      throw new ClickMeException("Unauthorized Request", 401);
    }

    if (!user.verified) {
      throw new ClickMeException("Email address is not verified", 400);
    }

    if (user) {
      req.user = user;
      return next();
    }
    return next();
  })(req, res, next);
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", (err, user: IUser) => {
    if (err) return next(err);

    if (!user?.id) {
      throw new ClickMeException("Unauthorized Request", 401);
    }

    if (!user.verified) {
      throw new ClickMeException("Email address is not verified", 400);
    }

    if (user) {
      req.user = user;
      return next();
    }
    return next();
  })(req, res, next);
};

export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   function auth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("headerapikey", (err, user) => {
    if (err) return next(err);

    if (!user?.id) {
      throw new ClickMeException("Unauthorized Request", 401);
    }

    if (!user?.verified) {
      throw new ClickMeException("Email address is not verified", 400);
    }

    if (user) {
      req.user = user;
      next();
    }
    next();
  })(req, res, next);
};
