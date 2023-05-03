import UserService from "./services";
import { Request, Response } from "express";

export const createUserAccount = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    console.log(user);
    if (user) {
      const createdUser = await UserService.createUserAccount(user);
      res.status(200).json(createdUser);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
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
      return res.status(200).json(user);
    } else {
      return res.status(404).send("User Not Found");
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
