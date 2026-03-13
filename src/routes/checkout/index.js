"use strict";

import Router from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import checkoutService from "../../controllers/checkout.controller.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = Router()
    .post('/review', asyncHandler(checkoutService.checkoutReview));

export default router;