import { PaymentStatus, Subscription, SubscriptionStatus } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const subscriptionSchema = Joi.object({
 subscriberId: Joi.string().required(),
 membershipId: Joi.string().required(),
});

const subscriptionUpdateSchema = Joi.object()
 .keys({
  status: Joi.string().valid("ACTIVE", "INACTIVE", "PENDING", "EXPIRED"),
  expiryDate: Joi.date().iso(),
 })
 .or("status", "expiryDate");

export const validateSubscription = (subscription: Subscription): { error: ValidationError; value: Subscription } => {
 return subscriptionSchema.validate(subscription, options) as unknown as {
  error: ValidationError;
  value: Subscription;
 };
};

export const validateSubscriptionOnUpdate = (
 subscription: Subscription,
): { error: ValidationError; value: Subscription } => {
 return subscriptionUpdateSchema.validate(subscription, options) as unknown as {
  error: ValidationError;
  value: Subscription;
 };
};
