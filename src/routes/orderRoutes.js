
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { getMyOrder, getMyOrderHistory} = require("../controllers/orderController");


router.get("/:id", authenticateToken, getMyOrder);
router.get("/", authenticateToken, getMyOrderHistory);
module.exports = router;