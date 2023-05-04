import UserService from "./services";
import { Request, Response } from "express";
import { validateUser } from "./user.validate";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";

//todo: after firebase auth integration, request should only contain firebase auth token in headers
//todo: we'll have a middleware that handle the firebase auth token verification and add the user object to the request object then we'll use it to create/update the user in the database
//* reference link https://github.com/yonaries/cyllo/blob/master/backend/src/middleware/middleware.ts

export const createUserAccount = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    const { error } = validateUser(user);
    if (error) return res.status(400).json({ error: error.message });
    const createdUser = await UserService.createUserAccount(user);

    return res.status(201).json({ user: createdUser });
  } catch (error: any) {
    return handlePrismaError(res, error, "User");
  }
};

export const getUserDataById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id.length === 0 || !id) {
    return res.status(400).json({ error: "User Id Is Required" });
  }

  try {
    const user = await UserService.getUserById(id);
    if (user != null) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: "User Not Found" });
    }
  } catch (error: any) {
    return handlePrismaError(res, error, "User");
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    if (users) {
      return res.status(200).json({ users });
    }
  } catch (error: any) {
    return handlePrismaError(res, error, "User");
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.body;

  if (id.length === 0 || !id)
    return res.status(400).json({ error: "User Id Is Required" });

  try {
    const { error } = validateUser(user);
    if (error) return res.status(400).json({ error: error.message });

    const updatedUser = await UserService.updateUserById(id, user);

    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    return handlePrismaError(res, error, "User");
  }
};
