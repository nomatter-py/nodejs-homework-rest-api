const Joi = require("joi");

const addContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(5).max(20).required(),
});

module.exports = addContactSchema;