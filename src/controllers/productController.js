const pool = require("../db");
const AppError = require("../utils/AppError");
const { getAllProducts, getProductById: findProductById, createProduct: addProduct, updateProduct: editProduct, deleteProduct: removeProduct, } = require("../services/productService");
const successResponse = require("../utils/apiResponse");

// get all products
// get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();

    successResponse(
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