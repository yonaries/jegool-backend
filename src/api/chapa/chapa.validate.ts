import { NextFunction } from "express";
import Joi from "joi";
import { Request, Response } from "express";

const initializeChapaSchema = Joi.object({
 first_name: Joi.string().required(),
 last_name: Joi.string().required(),
 email: Joi.string().email().required(),
 amount: Joi.number().required(),
 type: Joi.string().valid("SUBSCRIPTION", "DONATION").required(),
 membershipId: Joi.string().when("type", {
  is: "SUBSCRIPTION",
  then: Joi.required(),
 }),
 userId: Joi.string().when("type", {
  is: "SUBSCRIPTION",
  then: Joi.required(),
  otherwise: Joi.optional(),
 }),
 pageId: Joi.string().when("type", {
  is: "DONATION",
  then: Joi.required(),
 }),
 itemId: Joi.string().when("type", {
  is: "DONATION",
  then: Joi.required(),
 }),
 quantity: Joi.number().when("type", {
  is: "DONATION",
  then: Joi.required(),
 }),
 message: Joi.string().when("type", {
  is: "DONATION",
  then: Joi.optional(),
 }),
});

const callbackChapaSchema = Joi.object({
 tx_ref: Joi.string().required(),
 status: Joi.string().valid("successful", "failed").required(),
 type: Joi.string().valid("SUBSCRIPTION", "DONATION").required(),
 membershipId: Joi.string().when("type", {
  is: "SUBSCRIPTION",
  then: Joi.required(),
 }),
 userId: Joi.string().when("type", {
  is: "SUBSCRIPTION",
  then: Joi.required(),
  otherwise: Joi.optional(),
 }),
 pageId: Joi.string().when("type", {
  is: "DONATION",
  then: Joi.required(),
 }),
 itemId: Joi.string().when("type", {
  is: "DONATION",
  then: Joi.required(),
 }),
 quantity: Joi.number().when("type", {
  is: "DONATION",
  then: Joi.required(),
 }),
 message: Joi.string().when("type", {
  is: "DONATION",
  then: Joi.optional(),
 }),
});

export const validateInitializeChapa = (req: Request, res: Response, next: NextFunction) => {
 const { error } = initializeChapaSchema.validate(req.body);
 if (error) {
  return res.status(400).json({ error: error.details[0].message });
 }
 next();
};
