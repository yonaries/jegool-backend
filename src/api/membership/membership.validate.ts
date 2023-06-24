import { Membership } from "@prisma/client";
import Joi, { ValidationError } from "joi";
const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const membershipSchema = Joi.object({
 title: Joi.string().min(3).max(50).required(),
 fee: Joi.number().required(),
 status: Joi.boolean().required(),
 pageId: Joi.string().required(),
 coverImage: Joi.string().uri(),
 description: Joi.string().min(20),
 benefit: Joi.array().items(
  Joi.object({
   title: Joi.string().min(3).max(50).required(),
   description: Joi.string().min(20).required(),
  }),
 ),
});

const membershipUpdateSchema = Joi.object({
 title: Joi.string().min(3).max(50).required(),
 fee: Joi.number().required(),
 status: Joi.boolean().required(),
 pageId: Joi.string().required(),
 coverImage: Joi.string().uri(),
 description: Joi.string().min(20),
 benefit: Joi.array()
  .items(
   Joi.object({
    id: Joi.string(),
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(20).required(),
    membershipId: Joi.string().required(),
   }),
  )
  .required(),
});

export const validateMembership = (membership: Membership): { error: ValidationError; value: Membership } => {
 return membershipSchema.validate(membership, options) as unknown as {
  error: ValidationError;
  value: Membership;
 };
};

export const validateMembershipOnUpdate = (membership: Membership): { error: ValidationError; value: Membership } => {
 return membershipUpdateSchema.validate(membership, options) as unknown as {
  error: ValidationError;
  value: Membership;
 };
};
