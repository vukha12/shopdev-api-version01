"use strict";

import { model, Schema } from "mongoose";

const DOCUMET_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, default: "fixed_amount" }, // percentage
        discount_value: { type: Number, required: true }, // 10.000, 10%
        discount_code: { type: String, required: true }, // discount code
        discount_start_date: { type: Date, required: true }, // ngay bat dau
        discount_end_date: { type: Date, required: true }, // ngay ket thuc
        discount_max_uses: { type: Number, required: true }, // so luong discount duoc ap dung
        discount_uses_count: { type: Number, required: true }, // so luong discount đã được sử dụng
        discount_users_used: { type: Array, default: [] }, // danh sách các user đã sử dụng mã này
        discount_max_uses_per_user: { type: Number, required: true }, // so luong cho phep toi da duoc su dung moi user
        discount_min_order_value: { type: Number, required: true }, // gia tri don hang toi thieu
        discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        discount_is_active: { type: Boolean, default: true },
        discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] }, // all, specific
        discount_product_ids: { type: Array, default: [] } // neu ap dung cho specific san pham
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMET_NAME, discountSchema);
