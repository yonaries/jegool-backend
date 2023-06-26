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
 url: Joi.string().allow(""),
 headline: Joi.string().allow(""),
 profileImage: Joi.string().allow(""),
 description: Joi.string().allow(""),
 status: Joi.string().valid("DORMANT", "BANNED", "ACTIVE", "INACTIVE").allow(""),
 earningsVisibility: Joi.boolean(),
 supportersVisibility: Joi.boolean(),
 highlightedMembership: Joi.string().id().allow(""),
 coverImage: Joi.string().uri().allow(""),
 introVideo: Joi.string().uri().allow(""),
 brandColor: Joi.string().allow(""),
});

export const validatePage = (page: Page): { error: ValidationError; value: Page } => {
 return pageSchema.validate(page, options) as unknown as {
  error: ValidationError;
  value: Page;
 };
};
