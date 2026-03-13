import redisPubsubService from "../services/redisPubsub.service.js";

class InventoryTest {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (channel, message) => {
            console.log('Received message:', message);
            InventoryTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`[0001]: Updated inventory ${productId} with quantity ${quantity}`)
    }
}

export default new InventoryTest();