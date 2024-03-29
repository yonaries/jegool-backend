import { SocialLink } from "@prisma/client";
import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const socialLinkSchema = Joi.object({
 url: Joi.string().uri().required(),
 type: Joi.string().valid("FACEBOOK", "INSTAGRAM", "TWITTER", "YOUTUBE", "LINKEDIN", "TIKTOK").required(),
 pageId: Joi.string().required(),
});

const socialLinkUpdateSchema = Joi.object({
 url: Joi.string().uri(),
 type: Joi.string().valid("FACEBOOK", "INSTAGRAM", "TWITTER", "YOUTUBE", "LINKEDIN", "TIKTOK"),
});

export const validateSocialLink = (socialLink: SocialLink): { error: ValidationError; value: SocialLink } => {
 return socialLinkSchema.validate(socialLink, options) as unknown as {
  error: ValidationError;
  value: SocialLink;
 };
};

export const validateSocialLinkOnUpdate = (socialLink: SocialLink): { error: ValidationError; value: SocialLink } => {
 return socialLinkUpdateSchema.validate(socialLink, options) as unknown as {
  error: ValidationError;
  value: SocialLink;
 };
};
