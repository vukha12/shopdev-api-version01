'use strict'

import { createClient } from "redis";
import { reservationInventory } from "../models/repositories/inventory.repo.js";

const redisClient = createClient();
// await redisClient.connect();

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tạm lock

    for (let i = 0; i < retryTimes; i++) {
        const result = await redisClient.set(key, "locked", {
            NX: true,
            PX: expireTime
        })
        console.log(`result:::`, result)
        if (result === "OK") {
            // thao tác với inventory
            const isReversation = await reservationInventory({ productId, quantity, cartId })
            if (isReversation.modifiedCount) {
                return key
            }
            return null;
        } else {
            await releaseLock(key);
            return null
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
}

const releaseLock = async (keyLock) => {
    return await redisClient.del(keyLock)
}

export {
    acquireLock,
    releaseLock
}
