const express = require("express");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Product routes  
app.use("/api/products", productRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "MiniShop backend is running 🚀",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});