const pool = require("../db");
const AppError = require("../utils/AppError");
const { getAllProducts, getProductById: findProductById, createProduct: addProduct, updateProduct: editProduct, deleteProduct: removeProduct, } = require("../services/productService");
const successResponse = require("../utils/apiResponse");

// get all products

const getProducts = async (req, res, next) => {
  try {
    const search = (req.query.search || "").trim();
    const sortBy = req.query.sortBy || "id";
    const order = req.query.order || "asc";
    const brand = (req.query.brand || "").trim();

    const minPrice =
      req.query.minPrice === undefined
        ? undefined
        : Number(req.query.minPrice);

    const maxPrice =
      req.query.maxPrice === undefined
        ? undefined
        : Number(req.query.maxPrice);

    const allowedSortColumns = [
      "id",
      "product_name",
      "price",
      "brand",
    ];

    if (!allowedSortColumns.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sortBy value. Allowed values: ${allowedSortColumns.join(", ")}`,
      });
    }

    if (!["asc", "desc"].includes(order.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid order value. Allowed values: asc, desc",
      });
    }
    const pageParam = req.query.page;
    const limitParam = req.query.limit;

    const page =
      pageParam === undefined ? 1 : Number(pageParam);

    const limit =
      limitParam === undefined ? 10 : Number(limitParam);

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Page must be a positive whole number, and limit must be a positive whole number between 1 and 100",
      });
    }

    if (
      (minPrice !== undefined &&
        (!Number.isSafeInteger(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined &&
        (!Number.isSafeInteger(maxPrice) || maxPrice < 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "Prices must be non-negative whole numbers",
      });
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }



    const products = await getAllProducts(page, limit, search, sortBy, order, brand, minPrice, maxPrice);

    return successResponse(
      res,
      200,
      "Products retrieved successfully",
      products
    );
  } catch (error) {
    next(error);
  }
};

// get product by id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await findProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    successResponse(res, 200, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

//create product 
const createProduct = async (req, res, next) => {
  try {
    const { product_name, price, brand } = req.body;

    const product = await addProduct(product_name, price, brand);

    successResponse(res, 201, "Product created successfully", product);
  } catch (error) {
    next(error);
  }
};


// update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params; const { product_name, price, brand } = req.body;
    const product = await editProduct(id, product_name, price, brand);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    successResponse(res, 200, "Product updated successfully", product);
  } catch (error) {
    next(error);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await removeProduct(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    successResponse(res, 200, "Product deleted successfully", product);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct
};