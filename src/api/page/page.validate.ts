import { Page } from "@prisma/client";
import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const pageSchema = Joi.object({
 ownerId: Joi.string().id().required(),
 name: Joi.string().min(3).max(50).required(),
 url: Joi.string(),
 headline: Joi.string(),
 profileImage: Joi.string(),
 description: Joi.string(),
 status: Joi.string().valid("DORMANT", "BANNED", "ACTIVE", "INACTIVE"),
 earningsVisibility: Joi.boolean(),
 supportersVisibility: Joi.boolean(),
 highlightedMembership: Joi.string().id(),
 coverImage: Joi.string().uri(),
 introVideo: Joi.string().uri(),
 brandColor: Joi.string(),
});

export const validatePage = (page: Page): { error: ValidationError; value: Page } => {
 return pageSchema.validate(page, options) as unknown as {
  error: ValidationError;
  value: Page;
 };
};
