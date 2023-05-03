import UserService from "./services";
import { Request, Response } from "express";
import { validateUser } from "./user.validate";

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
    return res.status(400).json({ error: "User Id Is Required" });
  }

  try {
    const user = await UserService.getUserById(id);
    if (user != null) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: "User Not Found" });
    }
  } catch (error:any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    if (users) {
      return res.status(200).json({ users });
    }
  } catch (error:any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.body;

  if (id.length == 0 || !id)
    return res.status(400).json({ error: "User Id Is Required" });

  try {
    const { error } = validateUser(user);
    if (error) return res.status(400).json({ error: error.message });

    const updatedUser = await UserService.updateUserById(id, user);

    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
