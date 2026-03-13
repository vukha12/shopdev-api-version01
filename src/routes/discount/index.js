"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import discountController from "../../controllers/discount.controller.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = express.Router();

router.get("/amount", asyncHandler(discountController.getDiscountAmount))
router.get("/list_product_code", asyncHandler(discountController.getAllDiscountCodesWithProducts))
router.get("", asyncHandler(discountController.findAllDiscountCodesByShop))

// authentication //
router.use(authenticationV2);

// CRUD discount
router.post("", asyncHandler(discountController.createDiscount))

// QUERY //

export default router;