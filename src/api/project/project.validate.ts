import Joi from "joi";
import { Project } from "@prisma/client";

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const createProjectSchema = Joi.object<Project>({
  pageId: Joi.string().id().required(),
  title: Joi.string().required(),
  coverImage: Joi.string().uri(),
  description: Joi.string(),
  status: Joi.string(),
  visibleTo: Joi.array().items(Joi.string()).required(),
});

const updateProjectSchema = Joi.object<Project>({
  pageId: Joi.string().id().required(),
  title: Joi.string(),
  coverImage: Joi.string().uri(),
  description: Joi.string(),
  status: Joi.string(),
  visibleTo: Joi.array().items(Joi.string()),
});

export const validateCreateProject = (
  project: Project
): { error: Joi.ValidationError; value: Project } => {
  return createProjectSchema.validate(project, options) as unknown as {
    error: Joi.ValidationError;
    value: Project;
  };
};

export const validateUpdateProject = (
  project: Project
): { error: Joi.ValidationError; value: Project } => {
  return updateProjectSchema.validate(project, options) as unknown as {
    error: Joi.ValidationError;
    value: Project;
  };
};
