import Joi, { ValidationError } from "joi";

const options = {
 errors: {
  wrap: {
   label: "",
  },
 },
};

const goalSchema = Joi.object({
 title: Joi.string().required(),
 type: Joi.string().valid("COMMUNITY", "EARNING").required(),
 amount: Joi.number().required(),
 description: Joi.string().required(),
 pageId: Joi.string().required(),
});

const goalUpdateSchema = Joi.object({
 title: Joi.string(),
 type: Joi.string().valid("COMMUNITY", "EARNING"),
 amount: Joi.number(),
 description: Joi.string(),
});

export const validateGoal = (goal: any): { error: ValidationError; value: any } => {
 return goalSchema.validate(goal, options) as unknown as {
  error: ValidationError;
  value: any;
 };
};

export const validateGoalOnUpdate = (goal: any): { error: ValidationError; value: any } => {
 return goalUpdateSchema.validate(goal, options) as unknown as {
  error: ValidationError;
  value: any;
 };
};
