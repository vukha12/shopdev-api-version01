"use strict"

import { getProductById } from "../models/repositories/product.repo.js"
import { BadRequestError } from "../core/error.response.js"
import { addStockToInventory } from "../models/repositories/inventory.repo.js"

class InventoryService {
    static async addStockToInventory({
        stock, productId, shopId, location = '134, Tran Phu, HCM city'
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError("The product does not exists!")

        return await addStockToInventory({
            stock: stock, productId: productId, shopId: shopId, location: location
        })
    }

}

export default InventoryService