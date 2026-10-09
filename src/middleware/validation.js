const Joi = require("joi");

const productSchema = Joi.object({
  product_name: Joi.string().trim().required(),
  price: Joi.number().positive().required(),
  brand: Joi.string().trim().required(),
});

const validateProduct = (req, res, next) => {
  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;

  next();
};

module.exports = {
  validateProduct,
};