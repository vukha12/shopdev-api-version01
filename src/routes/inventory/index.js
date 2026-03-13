"use strict";

import Router from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import inventoryService from "../../controllers/inventory.controller.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = Router()

router.use(authenticationV2)
router.post('', asyncHandler(inventoryService.addStockToInventory));

export default router;