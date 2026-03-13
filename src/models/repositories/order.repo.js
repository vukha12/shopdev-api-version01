"user strict";

import orderModel from "../order.model.js";

const createOrderUser = async (payload) => {
    const { userId, checkout_order, user_address, user_payment, shop_order_ids_new } = payload

    return await orderModel.create({
        order_userId: userId,
        order_checkout: checkout_order,
        order_shipping: user_address,
        order_payment: user_payment,
        order_products: shop_order_ids_new
    })
}

export {
    createOrderUser
}