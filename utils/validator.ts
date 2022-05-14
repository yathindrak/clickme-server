import { body, param, ValidationChain } from "express-validator";
import PasswordValidator from "password-validator";
import * as userService from "../database/services/userService";

var passwordValidator = new PasswordValidator();
passwordValidator.is().min(6).is().max(20).has().uppercase().has().lowercase();

export const signUp: ValidationChain[] = [
  body("name", "Name is invalid").exists({
    checkFalsy: true,
    checkNull: true
  }),
  body("email", "Email is invalid")
    .isEmail()
    .isLength({ min: 0, max: 255 })
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await userService.getByEmail(value)

      if (user?.id) {
        req.user = user;
      }

      if (user?.verified) return Promise.reject();
    }),
  body("password", "Password is invalid")
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (value, { req }) => {
      const isValid = passwordValidator.validate(value);

      if (!isValid) {
        return Promise.reject();
      }
    })
];

export const signIn: ValidationChain[] = [
  body("email", "Email is invalid")
    .isEmail()
    .isLength({ min: 0, max: 255 })
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await userService.getByEmail(value)

      if (user?.id) {
        req.user = user;
      }

      if (!user?.verified) return Promise.reject();
    }),
  body("password", "Password is invalid")
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (value, { req }) => {
      const isValid = passwordValidator.validate(value);

      if (!isValid) {
        return Promise.reject();
      }
    })
];
