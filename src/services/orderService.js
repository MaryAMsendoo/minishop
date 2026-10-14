
const pool = require("../db");

const getOrderForUser = async (orderId, userId) => {
  const result = await pool.query(
    `SELECT id, user_id, order_date
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
       o.order_date,
       COALESCE(SUM(p.price * oi.quantity), 0) AS total_amount
     FROM orders o
     INNER JOIN orderItems oi
       ON o.id = oi.order_id
     INNER JOIN products p
       ON oi.product_id = p.id
     WHERE o.user_id = $1
     GROUP BY o.id, o.order_date
     ORDER BY o.order_date DESC`,
    [userId]
  );

  return result.rows;
};

module.exports = { getOrderForUser, getOrderHistory };