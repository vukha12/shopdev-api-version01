"use strict";

import { model, Schema } from "mongoose";

const DOCUMET_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

const inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
        inven_location: { type: String, required: true },
        inven_stock: { type: Number, required: true, min: 0 },
        inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        inven_reservations: { type: Array, default: [] }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMET_NAME, inventorySchema);
