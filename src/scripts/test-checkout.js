import CheckoutService from "../services/checkout.service.js";

const shop_order_ids = {
    "shop_order_ids": [
        {
            "shopId": "691c4e51aa837adbadd6b59b",
            "shop_discounts": [],
            "item_products": [
                {
                    "price": 50,
                    "quantity": 1,
                    "productId": "692813f55ff1164520ebd7a2"
                }
            ]
        },
        {
            "shopId": "691c4c5cb3fa4b239ee861da",
            "shop_discounts": [
                {
                    "shopId": "691c4c5cb3fa4b239ee861da",
                    "discountId": "692816e45ff1164520ebd7de",
                    "codeId": "SHOPE-222-1"
                }
            ],
            "item_products": [
                {
                    "price": 120,
                    "quantity": 2,
                    "productId": "692814de5ff1164520ebd7b7"
                }
            ]
        }
    ]
}
const cartId = "6928187fe77150c07d44f55f";
const userId = +1001

const result = CheckoutService.orderByUser({ shop_order_ids: shop_order_ids, cartId: cartId, userId: userId });

console.log(result)