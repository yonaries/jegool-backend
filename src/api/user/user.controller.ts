import UserService from "./services";
import { Request, Response } from "express";

export const createUserAccount = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    console.log(user);
    if (user) {
      const createdUser = await UserService.createUserAccount(user);
      res.status(200).json({ user: createdUser });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserDataById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id.length == 0 || !id) {
    return res.status(400).send("User Id Is Required");
  }

  try {
    const user = await UserService.getUserById(id);
    if (user != null) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).send({ error: "User Not Found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    if (users) {
      return res.status(200).json({ users });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
