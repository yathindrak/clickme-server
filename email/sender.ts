import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { IUser } from "../database/models/user";
import { ClickMeException } from "../utils/exception";
import { transporter } from "./transporter";
import handlebars from "handlebars";

dotenv.config();

const buildVerificationEmail = (user: IUser) => {
  const verifyEmailTemplateSource = fs.readFileSync(
    path.join(__dirname, "template-verification.html"),
    "utf8"
  );

  const emailVerificationTemplate = handlebars.compile(
    verifyEmailTemplateSource
  );
  
  return emailVerificationTemplate({
    domain: process.env.APP_DOMAIN,
    site_name: process.env.APP_NAME,
    verification: user.verificationCode
  });
};

export const sendVerificationEmail = async (user: IUser) => {
  if (!user?.verificationCode || !process.env.APP_DOMAIN) {
    throw new ClickMeException("Error in user verification");
  }

  try {
    const email = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Verify Email Address for ${process.env.APP_NAME}`,
      html: buildVerificationEmail(user)
    });

    if (!email.accepted.length) {
      throw new ClickMeException(
        "Couldn't send verification email. Try again later."
      );
    }
  } catch (error) {
    console.log(error)
    throw new ClickMeException(
      "Couldn't send verification email. Try again later.",
      500
    );
  }
};
