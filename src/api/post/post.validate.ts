import Joi from 'joi';

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
    status: Joi.string().valid('SCHEDULED', 'ACTIVE', 'INACTIVE').required(),
});