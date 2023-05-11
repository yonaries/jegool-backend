import Joi from "joi";
import { Benefit } from "@prisma/client";

const benefitSchema = Joi.object<Benefit>({
 membershipId: Joi.string().required(),
 title: Joi.string().required(),
 description: Joi.string().required(),
});

export const validateBenefit = (benefit: Benefit): { error: Joi.ValidationError; value: Benefit } => {
 return benefitSchema.validate(benefit, {
  abortEarly: false,
 }) as unknown as {
  error: Joi.ValidationError;
  value: Benefit;
 };
};
