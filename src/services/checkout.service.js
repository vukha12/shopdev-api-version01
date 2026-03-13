"use strict"

import { findCartById, findUserCart } from "../models/repositories/cart.repo.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { checkProductByServer } from "../models/repositories/product.repo.js";
import { getDiscountAmount } from "./discount.service.js";
import { acquireLock, releaseLock } from "./redis.service.js";

class CheckoutService {
    // login and without login
    /*
        {
            cartId,
            userId,
            shop_order_ids:[
                {
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {

        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError("Cart does not exists!");

        const checkout_order = {
            totalPrice: 0, // tổng tiền hàng
            feeShip: 0, // phí vận chuyển
            totalDiscount: 0, // tổng tiền discount giảm giá
            totalCheckout: 0, // tổng thanh toán
        };
        const shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];

            const checkProductServer = await checkProductByServer(item_products)
            console.log(`[checkProductServer]::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!')

            // tính tổng tiền đơn hàng
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // tổng cộng discount giảm giá 
                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = Math.max(checkoutPrice - discount, 0);
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        checkout_order.totalCheckout = Math.max(checkout_order.totalCheckout, 0);

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check lại một lần nữa xem vượt tồn kho hay không?
        // get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]::`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireLock.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check
        if (acquireProduct.includes(false)) {
            throw new BadRequestError("Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng!")
        }
        const orderPayload = {
            userId,
            checkout_order,
            user_address,
            user_payment,
            shop_order_ids_new
        }

        const newOrder = await createOrderUser(orderPayload)
        if (newOrder) {
            // remove product in cart
        }

        return newOrder;
    }

    static async getOrdersByUser() { }

    static async getOneOrderByUser() { }

    static async cancelOrderByUser() { }

    static async updateOrderStatusByShop() { }


}

export default CheckoutService