
import inventory from "../inventory.model.js";

// tạo kho khi 
const insertInventory = async ({
    productId, shopId, stock, location = 'unKnow'
}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}

//
const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: productId,
        inven_stock: { $gte: quantity }
    }
    const updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createdOn: new Date()
            }
        }
    }
    // const options = { upsert: true, new: true }

    return await inventory.updateOne(query, updateSet)
}

// 
const addStockToInventory = async ({ stock, productId, shopId, location }) => {
    const query = { inven_shopId: shopId, inven_productId: productId }
    const updateSet = {
        $inc: { inven_stock: stock },
        $set: {
            inven_location: location
        }
    }
    const option = { upsert: true, new: true }

    return await inventoryModel.findOneAndUpdate(query, updateSet, option)
}

export {
    insertInventory,
    reservationInventory,
    addStockToInventory
}
