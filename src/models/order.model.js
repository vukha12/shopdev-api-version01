"use strict";

import { model } from "mongoose"

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders'

const orderSchema = new model.Schema({
    order_userId: { type: Number, require: true },
    /*
    order_checkout = {
        totalPrice,
        totalApplyDiscount,
        freeShip
    }
    */
    order_checkout: { type: Object, default: {} },

    /*
   order_shipping = {
       street,
       city,
       state,
       country
   }
   */
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, default: [], require: true },
    order_status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'delivered', 'shipped'], default: 'pending' }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})

export default model(DOCUMENT_NAME, orderSchema)
