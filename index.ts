import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth'
import { ClickMeException } from './utils/exception';
import { generateApiKey } from './service/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// parse JSON bodies
app.use(express.json());
//  parse request body of content-type x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

function middleware1(req: Request, res: Response, next: NextFunction){
  // perform middleware function e.g. check if user is authenticated
  console.log("middleware1 is called !!!");
  next();  // move on to the next middleware

  // or

  // next("err");  // trigger error handler, usually to serve error page e.g. 403, 501 etc
}

app.get('/', middleware1, (req: Request, res: Response) => {
  console.log("function is called !!!");
  // throw new ClickMeException("asdd", "asdq", "asds")
  res.send('API server');
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
