const pool = require("../db");

// get all products


// get all products with search, sorting, and pagination
const getAllProducts = async (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "id",
  order = "asc"
) => {
  const offset = (page - 1) * limit;

  // Allow only approved column names
  const allowedColumns = [
    "id",
    "product_name",
    "price",
    "brand",
  ];

  const column = allowedColumns.includes(sortBy)
    ? sortBy
    : "id";

  // Allow only ASC or DESC
  const direction =
    order.toLowerCase() === "desc" ? "DESC" : "ASC";

  const result = await pool.query(
    `SELECT *
     FROM products
     WHERE product_name ILIKE $1
     ORDER BY ${column} ${direction}
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );

  return result.rows;
};



// get product by id
const getProductById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );

    return result.rows[0];
};

// create product
const createProduct = async (product_name, price, brand) => {
    const result = await pool.query(
        `INSERT INTO products (product_name, price, brand)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [product_name, price, brand]
    );

    return result.rows[0];
};

// update product
const updateProduct = async (id, product_name, price, brand) => {
    const result = await pool.query(`UPDATE products SET product_name = $1, price = $2, brand = $3 WHERE id = $4 RETURNING *`,
        [product_name, price, brand, id]);
    return result.rows[0];
};

// delete product
const deleteProduct = async (id) => {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};