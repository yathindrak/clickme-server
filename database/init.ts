import { User } from "./models";

const dbInit = () => {
  User.sync({ alter: true });
};
export default dbInit;
