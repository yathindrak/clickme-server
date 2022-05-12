import { Handler } from "express";
import { nanoid } from "nanoid";

export const generateApiKey: Handler = (req, res) => {
  // generate API key
  const apikey = nanoid(Number(process.env.API_KEY_LENGTH));

  return res.status(201).send({ apikey });
};
