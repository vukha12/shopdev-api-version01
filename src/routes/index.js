"use strict";

import express from "express";
import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import discountRouter from "./discount/index.js";
import checkoutRouter from "./checkout/index.js";
import inventoryRouter from "./inventory/index.js";
import cartRouter from "./cart/index.js";
import commentRouter from "./comment/index.js"
import notification from "./noti/index.js";
import uploadImageRouter from "./upload/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";
import { pushToLogDiscord } from "../middlewares/index.js";

const router = express.Router();

// add log to discord
router.use(pushToLogDiscord)

// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/checkout", checkoutRouter);
router.use("/v1/api/discount", discountRouter);
router.use("/v1/api/inventory", inventoryRouter);
router.use("/v1/api/cart", cartRouter);
router.use("/v1/api/upload", uploadImageRouter);
router.use("/v1/api/product", productRouter);
router.use("/v1/api/comment", commentRouter)
router.use("/v1/api/noti", notification)
router.use("/v1/api", accessRouter);


export default router;
