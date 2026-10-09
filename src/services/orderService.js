
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

module.exports = { getOrderForUser };