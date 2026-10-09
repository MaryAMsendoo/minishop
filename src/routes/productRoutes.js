const express = require("express");
const { validateProduct } = require("../middleware/validation");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  validateProduct,
  createProduct
);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;