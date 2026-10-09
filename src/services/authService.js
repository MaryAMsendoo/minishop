
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async ({
  first_name,
  last_name,
  phone_number,
  email,
  password,
}) => {
  const password_hash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users
      (first_name, last_name, phone_number, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, phone_number, email`,
    [
      first_name,
      last_name,
      phone_number,
      email,
      password_hash,
    ]
  );

  return result.rows[0];
};



const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, phone_number, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
};


module.exports = { registerUser, loginUser };

