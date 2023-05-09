import Joi from "joi";
import { Benefit } from "@prisma/client";

const createBenefitSchema = Joi.object<Benefit>({
	membershipId: Joi.string().required(),
	title: Joi.string().required(),
	description: Joi.string().required(),
});

export const validateCreateBenefit = (
	benefit: Benefit,
): { error: Joi.ValidationError; value: Benefit } => {
	return createBenefitSchema.validate(benefit, {
		abortEarly: false,
	}) as unknown as {
		error: Joi.ValidationError;
		value: Benefit;
	};
};
