const express = require("express");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "MiniShop backend is running 🚀",
  });
});

// Product routes  
app.use("/api/products", productRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});