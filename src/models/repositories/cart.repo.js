'use strict';

import cartModel from "../cart.model.js";

// tìm giỏ hàng
const findUserCart = async (userId) => {
    return cartModel.findOne({ cart_userId: userId });
}

const findCartById = async (cartId) => {
    return await cartModel.findById(cartId).lean();
}

// tạo giỏ hàng 
const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    };
    const option = { upsert: true, new: true };

    return cartModel.findOneAndUpdate(query, updateOrInsert, option)
}

// cập nhật lại giỏ hàng
const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    };
    const updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }
    const option = { upsert: true, new: true };

    return cartModel.findOneAndUpdate(query, updateSet, option)
}

// delete cart
const deleteItemProductInCart = async ({ userId, productId }) => {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateSet = {
        $pull: {
            cart_products: {
                productId
            }
        }
    }

    return cartModel.updateOne(query, updateSet);
}

// get list cart
const getUserCart = async ({ userId }) => {
    return cartModel.findOne({ cart_userId: +userId }).lean();
}

export {
    findUserCart,
    createUserCart,
    updateUserCartQuantity,
    deleteItemProductInCart,
    getUserCart,
    findCartById
}