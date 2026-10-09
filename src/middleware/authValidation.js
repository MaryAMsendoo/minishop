
const Joi = require("joi");

const registerSchema = Joi.object({
    first_name: Joi.string().trim().min(2).max(100).required(),
    last_name: Joi.string().trim().min(2).max(100).required(),

    phone_number: Joi.string()
        .trim()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .required(),

    email: Joi.string().trim().email().max(100).required(),

    password: Joi.string().min(8).max(100).required(),
});

const validateRegistration = (req, res, next) => {
    const { error, value } = registerSchema.validate(req.body, {
        abortEarly: false,
        convert: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    req.body = value;
    next();
};


const loginSchema = Joi.object({
    email: Joi.string().trim().email().max(100).required(),
    password: Joi.string().min(1).max(100).required(),
});

const validateLogin = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    req.body = value;
    next();
};



module.exports = { validateRegistration, validateLogin };

