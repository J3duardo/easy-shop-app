const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const PORT = process.env.PORT || 7500;

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("Database connected successfully");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
});

mongoose.connection.on("error", (error) => {
  console.log(`Error connecting to database: ${error.message}`);
  process.exit(1);
});