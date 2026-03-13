'use strict';

import { createUserCart, deleteItemProductInCart, findUserCart, getUserCart, updateUserCartQuantity } from "../models/repositories/cart.repo.js";
import { getProductById } from "../models/repositories/product.repo.js";
import { NotFoundError } from '../core/error.response.js'

class CartService {

    // create cart
    static async addToCart({ userId, product = {} }) {

        // tìm giỏ hàng đã tồn tại hay chưa
        const userCart = await findUserCart(userId);

        if (!userCart) {
            // tạo giỏ hàng cho user
            return await createUserCart({ userId, product })
        }

        // nếu có giỏ hàng rồi nhưng chưa có sản phẩm?
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }
        const hasProduct = userCart.cart_products.find(p => p.productId === product.productId);

        if (hasProduct) {
            // TRƯỜNG HỢP A: Sản phẩm ĐÃ CÓ -> Tăng số lượng (Dùng hàm có $)
            return await updateUserCartQuantity({ userId, product });
        }

        return await createUserCart({ userId, product })
    }

    // update cart
    /*
        "shop_order_ids":[
            {
                "shopId",
                "item_products":[
                {
                    "quantity",
                    "price",
                    "shopId",
                    "old_quantity",
                    "productId"
                }
                ],
                version
            }
        ]
    */
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Fail product');
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError("Product do not belong to the shop")
        }

        if (quantity === 0) {
            return await deleteItemProductInCart({ userId, productId });
        }

        return await updateUserCartQuantity({
            userId, product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteItemProductInCart({ userId, productId }) {
        return await deleteItemProductInCart({ userId, productId });
    }


    // lấy danh sách giỏ hàng user
    static async getListUserCart({ userId }) {
        return await getUserCart({ userId });
    }
}

export default CartService;