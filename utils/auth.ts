import JWT from "jsonwebtoken";
import { IUser } from "../database/models/user";

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
