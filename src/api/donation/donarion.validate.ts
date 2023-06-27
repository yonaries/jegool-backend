import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const donation = Joi.object({
 donorName: Joi.string().required(),
 donorEmail: Joi.string().email().required(),
 itemId: Joi.string().required(),
 pageId: Joi.string().required(),
 quantity: Joi.number().required(),
 message: Joi.string().required(),
});

export const validateDonation = (donationItem: any): { error: ValidationError; value: any } => {
 return donation.validate(donationItem, options) as unknown as {
  error: ValidationError;
  value: any;
 };
};
