import { User } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "joi:",
  },
 },
};

const userSchema = Joi.object({
 id: Joi.string().id().required(),
 firstName: Joi.string().min(3).max(50),
 lastName: Joi.string().min(3).max(50),
 displayName: Joi.string().min(1).max(50).required(),
 email: Joi.string()
  .email({ tlds: { allow: ["com", "net"] } })
  .required(),
 residence: Joi.string().min(2).max(50),
 status: Joi.boolean(),
 profileImage: Joi.string().min(1),
});

export const validateUser = (user: User): { error: ValidationError; value: User } => {
 return userSchema.validate(user, options) as unknown as {
  error: ValidationError;
  value: User;
 };
};
