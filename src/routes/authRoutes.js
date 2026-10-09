
const express = require("express");
const router = express.Router();

const {
  validateRegistration,
  validateLogin,
} = require("../middleware/authValidation");

const {
  register,
  login,
} = require("../controllers/authController");

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);

module.exports = router;
