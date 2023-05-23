import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const donationItemSchema = Joi.object({
 name: Joi.string().required(),
 price: Joi.number().required(),
 image: Joi.string().required(),
 status: Joi.boolean().default(true),
});

export const validateDonationItem = (donationItem: any): { error: ValidationError; value: any } => {
 return donationItemSchema.validate(donationItem, options) as unknown as {
  error: ValidationError;
  value: any;
 };
};
