const pool = require("../db");

const getOrderForUser = async (orderId, userId) => {
  const result = await pool.query(
    `SELECT id, user_id, order_date, status
     FROM orders
     WHERE id = $1 AND user_id = $2`,
    [orderId, userId]
  );

  return result.rows[0] || null;
};

const getOrderHistory = async (userId) => {
  const result = await pool.query(
    `SELECT
       o.id,
       o.status,
       o.order_date,
       COALESCE(SUM(p.price * oi.quantity), 0) AS total_amount
     FROM orders o
     INNER JOIN orderItems oi
       ON o.id = oi.order_id
     INNER JOIN products p
       ON oi.product_id = p.id
     WHERE o.user_id = $1
     GROUP BY o.id, o.status, o.order_date
     ORDER BY o.order_date DESC`,
    [userId]
  );

  return result.rows;
};

const createOrder = async (userId, items) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check that every requested product exists.
    const productIds = [...new Set(items.map((item) => item.product_id))];

    const productsResult = await client.query(
      `SELECT id
       FROM products
       WHERE id = ANY($1::int[])`,
      [productIds]
    );

    const existingProductIds = new Set(
      productsResult.rows.map((product) => product.id)
    );

    const missingProductIds = productIds.filter(
      (productId) => !existingProductIds.has(productId)
    );

    if (missingProductIds.length > 0) {
      const error = new Error(
        `Products not found: ${missingProductIds.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Create the order and obtain its ID and status.
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_date)
       VALUES ($1, CURRENT_TIMESTAMP)
       RETURNING id, user_id, order_date, status`,
      [userId]
    );

    const order = orderResult.rows[0];
    const createdItems = [];

    // Insert each item using the new order ID.
    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO orderItems (order_id, product_id, quantity)
         VALUES ($1, $2, $3)
         RETURNING id, order_id, product_id, quantity`,
        [order.id, item.product_id, item.quantity]
      );

      createdItems.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...order,
      items: createdItems,
    };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      error.rollbackError = rollbackError;
    }

    throw error;
  } finally {
    client.release();
  }
};

const cancelOrder = async (orderId, userId) => {
  const result = await pool.query(
    `UPDATE orders
     SET status = 'cancelled'
     WHERE id = $1
       AND user_id = $2
       AND status = 'pending'
     RETURNING id, user_id, status, order_date`,
    [orderId, userId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

module.exports = {
  getOrderForUser,
  getOrderHistory,
  createOrder,
  cancelOrder,
};
