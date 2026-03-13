import redisPubsubService from "../services/redisPubsub.service.js";

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }
        console.log('productId', productId)
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

export default new ProductServiceTest();