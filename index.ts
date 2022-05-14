import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { ClickMeException } from "./utils/exception";
import router from "./routes/routes";
import dbInit from "./database/init";
import * as handler from "./utils/handler";

dotenv.config();

dbInit();

function middleware1(req: Request, res: Response, next: NextFunction) {
  // perform middleware function e.g. check if user is authenticated
  console.log("middleware1 is called !!!");
  next(); // move on to the next middleware

  // or

  // next("err");  // trigger error handler, usually to serve error page e.g. 403, 501 etc
}

const getApp = () => {
  const app: Express = express();

  // parse JSON bodies
  app.use(express.json());
  //  parse request body of content-type x-www-form-urlencoded
  app.use(
    express.urlencoded({
      extended: true
    })
  );

  app.get("/", middleware1, (req: Request, res: Response) => {
    // throw new ClickMeException("asdd", "asdq", "asds")
    res.send("API server");
  });

  app.use("/api", router);
  app.use(handler.error);

  return app;
};

const startServer = () => {
  const port = process.env.PORT || 8080;
  const app = getApp();

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
};

startServer();
