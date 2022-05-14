import * as userDal from "../dal/user";
import { GetAllUsersFilters } from "../dal/types";
import { UserInput, IUser } from "../models/user";

export const create = (payload: UserInput): Promise<IUser> => {
  return userDal.create(payload);
};

export const update = (
  id: number,
  payload: any
): Promise<void> => {
  return userDal.update(id, payload);
};

export const getById = (id: number): Promise<IUser> => {
  return userDal.getById(id);
};

export const getByEmail = (email: string): Promise<IUser> => {
  return userDal.getByEmail(email);
};

export const getByEmailVerificationCode = (verificationCode: string): Promise<IUser> => {
  return userDal.getByEmailVerificationCode(verificationCode);
};

export const getByApiKey = (apikey: string): Promise<IUser> => {
  return userDal.getByApiKey(apikey);
};

export const deleteById = (id: number): Promise<boolean> => {
  return userDal.deleteById(id);
};
export const getAll = (filters: GetAllUsersFilters): Promise<IUser[]> => {
  return userDal.getAll(filters);
};
