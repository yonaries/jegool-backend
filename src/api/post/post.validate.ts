import { Post } from "@prisma/client";
import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const postSchema = Joi.object({
 pageId: Joi.string().id().required(),
 title: Joi.string().required(),
 type: Joi.string().valid("TEXT", "IMAGE", "VIDEO", "AUDIO", "FILE").required(),
 caption: Joi.string(),
 thumbnail: Joi.string(),
 file: Joi.string().uri(),
 visibleTo: Joi.array().items(Joi.string().id()),
 scheduled: Joi.date(),
 status: Joi.string().valid("SCHEDULED", "BANNED", "ACTIVE", "INACTIVE"),
});

const postFilterSchema = Joi.object({
 pageId: Joi.string().id(),
 title: Joi.string(),
 type: Joi.string().valid("TEXT", "IMAGE", "VIDEO", "AUDIO", "FILE"),
 caption: Joi.string(),
 thumbnail: Joi.string(),
 file: Joi.string().uri(),
 visibleTo: Joi.string().id(),
 scheduled: Joi.date(),
 status: Joi.string().valid("SCHEDULED", "BANNED", "ACTIVE", "INACTIVE"),
});

export const validatePost = (post: Post): { error: ValidationError; value: Post } => {
 return postSchema.validate(post, options) as unknown as {
  error: ValidationError;
  value: Post;
 };
};

export const validatePostFilter = (post: Post): { error: ValidationError; value: Post } => {
 return postFilterSchema.validate(post, options) as unknown as {
  error: ValidationError;
  value: Post;
 };
};
