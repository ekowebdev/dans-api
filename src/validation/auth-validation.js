import Joi from "joi";

const registerValidation = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().max(100).email().required(),
    password: Joi.string().max(100).required()
});

const loginValidation = Joi.object({
    email: Joi.string().max(100).email().required(),
    password: Joi.string().max(100).required()
});

export {
    registerValidation,
    loginValidation,
}
