import { Op } from "sequelize";
import { User } from "../models";
import { GetAllUsersFilters } from "./types";
import { UserInput, IUser } from "../models/user";

export const create = async (payload: UserInput): Promise<IUser> => {
  return await User.create(payload);
};

export const update = async (
  id: number,
  payload: Partial<UserInput>
): Promise<IUser> => {
  const user = await User.findByPk(id);
  if (!user) {
    // @todo throw custom error
    throw new Error("not found");
  }
  const updatedUser = await (user as User).update(payload);
  return updatedUser;
};

export const getById = async (id: number): Promise<IUser> => {
  return await User.findByPk(id) ?? {} as IUser;
};

export const getByEmail = async (email: string): Promise<IUser> => {
  return await User.findOne({where: { email }})?? {} as IUser;
};

export const getByEmailVerificationCode = async (verificationCode: string): Promise<IUser> => {
  return await User.findOne({where: { verificationCode }})?? {} as IUser;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedIngredientCount = await User.destroy({
    where: { id }
  });
  return !!deletedIngredientCount;
};

export const getAll = async (
  filters?: GetAllUsersFilters
): Promise<IUser[]> => {
  return User.findAll({
    where: {
      ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } })
    },
    ...((filters?.isDeleted || filters?.includeDeleted) && {
      paranoid: true
    })
  });
};
