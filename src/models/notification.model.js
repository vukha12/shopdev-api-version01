'use strict';

import { model, Schema } from "mongoose";

const DOCUMET_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// Create Schema

const notificationSchema = new Schema(
    {
        noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
        noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
        noti_receiverId: { type: Number, required: true },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMET_NAME, notificationSchema);
