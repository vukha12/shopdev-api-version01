'use strict';
import discountModel from "../discount.model.js";
import { NotFoundError } from "../../core/error.response.js";
import { getSelectData, unGetSelectData } from "../../utils/index.js";
/*
    Discount Service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount code [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
 */

// Create discount code
const createDiscount = async (payload) => {
    const {
        code, start_date, end_date, is_active, shopId,
        min_order_value, product_ids, applies_to, name,
        description, type, value, max_uses,
        uses_count, max_uses_per_user, users_used
    } = payload;
    return await discountModel.create({
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_code: code,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,
        discount_users_used: users_used,
        discount_max_uses_per_user: max_uses_per_user,
        discount_min_order_value: min_order_value || 0,
        discount_shopId: shopId,
        discount_is_active: is_active,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === 'all' ? [] : product_ids,
    })
}

// Delete discount
const finddeleteDiscount = async (filter) => {
    return await discountModel.findOneAndDelete(filter)
}

// Find all discount code Un Select
const findAllDiscountCodesUnSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
}

// // Find all discount code Select
const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const result = discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return result
}

// Find discount code
const findDiscount = async (filter) => {
    return await discountModel.findOne(filter).lean();
}

// huỷ chiết khấu
const cancelDiscountCode = async ({ codeId, shopId, userId }) => {
    const foundDiscount = await findDiscount({
        discount_code: codeId,
        discount_shopId: shopId
    })

    if (!foundDiscount) throw new NotFoundError(`discount doesn't exitst`)

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
        $pull: { discount_users_used: userId },
        $inc: {
            discount_max_uses: 1,
            discount_uses_count: -1
        }
    })
    return result
}

export {
    findDiscount,
    createDiscount,
    finddeleteDiscount,
    findAllDiscountCodesUnSelect,
    cancelDiscountCode
}