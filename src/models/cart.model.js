"use strict";

import { model, Schema } from "mongoose";

const DOCUMET_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            require: true,
            enum: ['active', 'completed', 'failed', 'pending'],
            default: 'active'
        },
        cart_products: { type: Array, require: true, default: [] },
        cart_count_product: { type: Number, default: 0 },
        cart_userId: { type: Number, require: true }
    },
    {
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'modifiedOn'
        },
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMET_NAME, cartSchema);
