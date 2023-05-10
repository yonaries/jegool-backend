import { User } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const userSchema = Joi.object({
 firstName: Joi.string().min(3).max(50).required(),
 lastName: Joi.string().min(3).max(50).required(),
 displayName: Joi.string().min(1).max(50).required(),
 email: Joi.string()
  .email({ tlds: { allow: ["com", "net"] } })
  .required(),
 residence: Joi.string().min(2).max(50).required(),
 status: Joi.boolean(),
 profileImage: Joi.string().min(1),
});

export const validateUser = (user: User): { error: ValidationError; value: User } => {
 return userSchema.validate(user, options) as unknown as {
  error: ValidationError;
  value: User;
 };
};
