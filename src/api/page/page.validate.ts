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
    name: Joi.string().min(3).max(50).required(),
    url: Joi.string().uri().required(),
});

export const validatePage = (
    page: Page
): { error: ValidationError; value: Page } => {
    return pageSchema.validate(page, options) as unknown as {
        error: ValidationError;
        value: Page;
    };
};