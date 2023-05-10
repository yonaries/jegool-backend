import UserService from "./services";
import { Request, Response } from "express";
import { validateUser } from "./user.validate";
import { PrismaError } from "../../errors/prisma.error";
import { SubscriptionStatus } from "@prisma/client";

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
 } catch (error) {
  return PrismaError(res, error);
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
 } catch (error) {
  return PrismaError(res, error);
 }
};

export const getAllUsers = async (req: Request, res: Response) => {
 try {
  const users = await UserService.getUsers();
  if (users) {
   return res.status(200).json({ users });
  }
 } catch (error) {
  return PrismaError(res, error);
 }
};

export const updateUserData = async (req: Request, res: Response) => {
 const { id } = req.params;
 const user = req.body;

 if (id.length === 0 || !id) return res.status(400).json({ error: "User Id Is Required" });

 try {
  const { error } = validateUser(user);
  if (error) return res.status(400).json({ error: error.message });

  const updatedUser = await UserService.updateUserById(id, user);

  return res.status(200).json({ user: updatedUser });
 } catch (error) {
  return PrismaError(res, error);
 }
};

export const deleteUserData = async (req: Request, res: Response) => {
 const { id } = req.params;

 if (id.length === 0 || !id) return res.status(400).json({ error: "User Id Is Required" });

 try {
  const deletedUser = await UserService.deleteUserById(id);

  return res.status(200).json({ user: deletedUser });
 } catch (error) {
  return PrismaError(res, error);
 }
};

export const getUserSubscriptionsById = async (req: Request, res: Response) => {
 const { id } = req.params;
 const queryParam = req.query;

 if (id.length === 0 || !id) return res.status(400).json({ error: "User Id Is Required" });

 const status = queryParam.status?.toString().toUpperCase();
 if (
  status &&
  status.toString().toUpperCase() !== "ACTIVE" &&
  status.toString().toUpperCase() !== "INACTIVE" &&
  status.toString().toUpperCase() !== "CANCELLED" &&
  status.toString().toUpperCase() !== "EXPIRED"
 ) {
  return res.status(400).json({ error: "Invalid status query parameter" });
 }

 try {
  const subscriptions = status
   ? await UserService.getUserSubscriptionsById(id, status as SubscriptionStatus)
   : await UserService.getUserSubscriptionsById(id);

  return res.status(200).json({ subscriptions: subscriptions });
 } catch (error) {
  return PrismaError(res, error);
 }
};
