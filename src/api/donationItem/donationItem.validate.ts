import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const donationItemSchema = Joi.object({
 name: Joi.string().min(1).required(),
 price: Joi.number().positive().required(),
 image: Joi.string().min(1).required(),
 status: Joi.boolean().default(true),
});

const donationItemUpdateSchema = Joi.object({
 name: Joi.string().min(1),
 price: Joi.number().positive(),
 image: Joi.string().min(1),
 status: Joi.boolean(),
});

export const validateDonationItem = (donationItem: any): { error: ValidationError; value: any } => {
 return donationItemSchema.validate(donationItem, options) as unknown as {
  error: ValidationError;
  value: any;
 };
};

export const validateDonationItemOnUpdate = (donationItem: any): { error: ValidationError; value: any } => {
 return donationItemUpdateSchema.validate(donationItem, options) as unknown as {
  error: ValidationError;
  value: any;
 };
};
