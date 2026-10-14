const pool = require("../db");

// get all products


// get all products with search, filtering, sorting, and pagination
const getAllProducts = async (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "id",
  order = "asc",
  brand = "",
  minPrice,
  maxPrice
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

  // Build filter conditions safely
  const conditions = ["product_name ILIKE $1"];
  const values = [`%${search}%`];

  if (brand) {
    values.push(brand);
    conditions.push(`brand ILIKE $${values.length}`);
  }

  if (minPrice !== undefined) {
    values.push(minPrice);
    conditions.push(`price >= $${values.length}`);
  }

  if (maxPrice !== undefined) {
    values.push(maxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  // Add pagination parameters
  values.push(limit);
  const limitPosition = values.length;

  values.push(offset);
  const offsetPosition = values.length;

  const query = `
    SELECT *
    FROM products
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${column} ${direction}
    LIMIT $${limitPosition}
    OFFSET $${offsetPosition}
  `;

  const result = await pool.query(query, values);

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