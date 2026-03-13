import "dotenv/config";

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./routes/index.js";
import inventoryTest from "./test/inventory.test.js";
import productTest from "./test/product.test.js";

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// test pub/sub redis
productTest.purchaseProduct('product:001', 10);

// init db
import mongoose from "./dbs/init.mongodb.js";

// init routes
app.use("/", router);

// handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    // stack: error.stack,
    message: error.message || "Interal Server Error",
  });
});

export default app;
