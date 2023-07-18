import Joi from "joi";

const getJobValidation = Joi.object({
    description: Joi.string().lowercase().optional(),
    location: Joi.string().lowercase().optional(),
    full_time: Joi.boolean().optional(),
    page: Joi.number().min(1).positive().default(1),
    per_page: Joi.number().min(1).positive().max(100).default(10),
})

const getByIdJobValidation = Joi.string().required();

export {
    getJobValidation,
    getByIdJobValidation
}
