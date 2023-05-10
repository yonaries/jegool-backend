import { User } from "@prisma/client";
import Express from "express";
import Joi from "joi";

export const validateCreateUser = async (req: Express.Request, res: Express.Response, next: Function) => {
 const createUserValidator = Joi.object({
  id: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  displayName: Joi.string().required(),
  profileImage: Joi.string(),
  residence: Joi.string(),
 });

 const data: User = req.body;

 try {
  const result = await createUserValidator.validateAsync(data);
  req.body = result;
  next();
 } catch (error) {
  res.status(400).send(error);
 }
};
