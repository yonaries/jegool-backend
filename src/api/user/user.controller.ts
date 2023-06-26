import UserService from "./services";
import { Request, Response } from "express";
import { validateUser } from "./user.validate";
import { PrismaError } from "../../errors/prisma.error";
import { SubscriptionStatus, User } from "@prisma/client";
import ChatServices from "../chat/service";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

export const createUserAccount = async (req: Request, res: Response) => {
 const user = req.body.user as UserRecord;
 const payload = {
  id: user.uid,
  email: user.email,
  displayName: user.displayName,
  profileImage: user.photoURL,
 } as User;

 try {
  const { error } = validateUser(payload);
  if (error) return res.status(400).json({ error: error.message });

  const exist = await UserService.userExist(user.uid);
  if (exist) return res.status(200).json({ user: exist });

  const createdUser = await UserService.createUserAccount(payload);
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
 const user = {
  id: req.body.id,
  displayName:req.body.displayName,
  firstName:req.body.firstName,
  lastName:req.body.lastName,
  profileImage:req.body.profileImage
 };
 console.log(user);
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

export const getUserPrivateChats = async (req: Request, res: Response) => {
 const { id } = req.params;

 if (id.length === 0 || !id) return res.status(400).json({ error: "User Id Is Required" });

 try {
  const user = await UserService.getUserById(id);
  if (!user) return res.status(404).json({ error: "User Not Found" });
  const privateChats = await ChatServices.getPrivateChatsByUserId(id);

  if (!privateChats) return res.status(404).json({ error: "Private Chats Not Found" });

  return res.status(200).json({ privateChats: privateChats });
 } catch (error) {
  return PrismaError(res, error);
 }
};
