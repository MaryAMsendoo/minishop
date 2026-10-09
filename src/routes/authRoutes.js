
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

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

router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    data: {
      userId: req.user.userId,
    },
  });
});

module.exports = router;
