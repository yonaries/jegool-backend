import { PaymentStatus, Subscription } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const subscriptionSchema = Joi.object({
  status: Joi.string()
    .valid(PaymentStatus.PENDING, PaymentStatus.SUCCESS)
    .required(),
  subscriberId: Joi.string().required(),
  membershipId: Joi.string().required(),
  transactionId: Joi.string().required(),
});

export const validateSubscription = (
  subscription: Subscription
): { error: ValidationError; value: Subscription } => {
  return subscriptionSchema.validate(subscription, options) as unknown as {
    error: ValidationError;
    value: Subscription;
  };
};
