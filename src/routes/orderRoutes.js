const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { validateCreateOrder } = require("../middleware/orderValidation");

const {
  getMyOrder,
  getMyOrderHistory,
  createMyOrder,
  cancelMyOrder,
} = require("../controllers/orderController");

router.post(
  "/",
  authenticateToken,
  validateCreateOrder,
  createMyOrder
);

router.get("/:id", authenticateToken, getMyOrder);
router.get("/", authenticateToken, getMyOrderHistory);
router.patch("/:id/cancel", authenticateToken, cancelMyOrder);
module.exports = router;
