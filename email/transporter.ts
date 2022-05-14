import nodemailer from "nodemailer";

const config = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Boolean(process.env.EMAIL_IS_SECURE),
  requireTLS: Boolean(process.env.EMAIL_REQUIRE_TLS),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  logger: true
};

export const transporter = nodemailer.createTransport(config);
