'use strict';
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import {
    createDiscount,
    findDiscount,
    finddeleteDiscount,
    findAllDiscountCodesUnSelect,
    cancelDiscountCode
} from "../models/repositories/discount.repo.js";
import { findAllProducts } from "../models/repositories/product.repo.js";

// tạo discount code
const createDiscountCodes = async (payload) => {
    const { code, start_date, end_date, shopId, } = payload;
    const now = new Date();
    if (now < new Date(start_date) || now > new Date(end_date)) {
        throw new BadRequestError('Discount code has expried!')
    }

    if (new Date(start_date) >= new Date(end_date)) {
        throw new BadRequestError('Invalid discount time range!')
    }

    // Check discount code tồn tại
    const discount = await findDiscount({
        discount_code: code,
        discount_shopId: shopId
    })
    if (discount) {
        throw new BadRequestError('Discount code already exists!');
    }

    // Create Discount code
    const newDiscount = await createDiscount(payload)
    return newDiscount;
}

// lấy số tiền chiết khấu cho tổng hoá đơn
const getDiscountAmount = async ({ codeId, userId, shopId, products }) => {
    const foundDiscount = await findDiscount({
        discount_code: codeId,
        discount_shopId: shopId
    })

    if (!foundDiscount) throw new NotFoundError('Disscount does not exitst')

    const {
        discount_is_active,
        discount_max_uses,
        discount_start_date,
        discount_end_date,
        discount_min_order_value,
        discount_users_used,
        discount_value,
        discount_type,
        discount_max_uses_per_user,
        discount_uses_count
    } = foundDiscount

    if (!discount_is_active) throw new NotFoundError(`discount expried`)
    if (discount_uses_count >= discount_max_uses) throw new NotFoundError(`discount expried`)

    const now = new Date();
    if (now < new Date(discount_start_date) || now > new Date(discount_end_date)) {
        throw new NotFoundError('Discount code has expried!')
    }

    if (discount_max_uses_per_user > 0) {
        const userUserDiscount = discount_users_used.find(user => user.userId === userId)
        if (userUserDiscount) {
            //...
        }
    }

    // check xem cos
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
        totalOrder = products.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        }, 0)

        if (totalOrder < discount_min_order_value) {
            throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}!`)
        }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
        totalOrder,
        discount: amount,
        totalPrice: totalOrder - amount
    }
}

// xoá discount
const deleteDiscount = async ({ shopId, codeId }) => {
    return await finddeleteDiscount({
        filter: {
            discount_code: codeId,
            discount_shopId: shopId
        }
    })
}

// Lấy tất cả các chiết khấu của shop
const findAllDiscountCodesByShop = async ({ limit, page, shopId }) => {
    return await findAllDiscountCodesUnSelect({
        limit: +limit,
        page: +page,
        filter: {
            discount_shopId: shopId,
            discount_is_active: true
        },
        select: ['discount_code', 'discount_name']
    })
}

// Lấy tất cả các chiết khẩu của sản phẩm đó
const getAllDiscountCodeWithProduct = async ({ code, shopId, limit, page }) => {
    // create index for discount_code
    const discount = await findDiscount({
        discount_code: code,
        discount_shopId: shopId
    });

    if (!discount || !discount.discount_is_active) {
        throw new NotFoundError('Discount not exists!');
    }

    const { discount_applies_to, discount_product_ids } = discount
    let products
    if (discount_applies_to === 'all') {
        // get all product
        products = await findAllProducts({
            filter: {
                product_shop: shopId,
                isPublish: true
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        })
    }

    if (discount_applies_to === 'specific') {
        // get specific product
        products = await findAllProducts({
            filter: {
                _id: { $in: discount_product_ids },
                isPublish: true
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        })
    }

    return products
}

// Huỷ chiết khấu
const getcancelDiscountCode = async ({ codeId, shopId, userId }) => {
    return await cancelDiscountCode({ codeId, shopId, userId });
}

export {
    createDiscountCodes,
    getDiscountAmount,
    deleteDiscount,
    findAllDiscountCodesByShop,
    getAllDiscountCodeWithProduct,
    getcancelDiscountCode
}