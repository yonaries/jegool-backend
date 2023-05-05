import { Post } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

const options = {
    errors: {
        wrap: {
            label: "",
        },
    },
};

const postSchema = Joi.object({
    title: Joi.string().required(),
    caption: Joi.string(),
    type: Joi.string().valid('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE').required(),
    thumbnail: Joi.string(),
    file: Joi.string().uri(),
    visibleTo: Joi.array().items(Joi.string().id()),
    scheduled: Joi.date(),
    status: Joi.string().valid('SCHEDULED', 'BANNED', 'ACTIVE', 'INACTIVE').required(),
});

export const validatePost = (
    post: Post
): { error: ValidationError; value: Post } => {
    return postSchema.validate(post, options) as unknown as {
        error: ValidationError;
        value: Post;
    };
};