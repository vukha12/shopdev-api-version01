'use strict';

import { CREATED, SuccessResponse } from "../core/success.response.js";
import InventoryService from "../services/inventory.service.js";

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new CREATED({
            message: 'Create discount success',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

export default new InventoryController();