
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { getMyOrder } = require("../controllers/orderController");

router.get("/:id", authenticateToken, getMyOrder);

module.exports = router;