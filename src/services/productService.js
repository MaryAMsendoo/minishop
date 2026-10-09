const pool = require("../db");

// get all products
const getAllProducts = async () => {
    const result = await pool.query("SELECT * FROM products");

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