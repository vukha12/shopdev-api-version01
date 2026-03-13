"use strict";

import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import CartController from "../../controllers/cart.controller.js";

const router = Router()
    .post('', asyncHandler(CartController.addToCart))
    .delete('', asyncHandler(CartController.delete))
    .patch('/update', asyncHandler(CartController.update))
    .get('', asyncHandler(CartController.listToCart))

export default router;