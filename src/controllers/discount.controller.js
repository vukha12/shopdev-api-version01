'use strict';

import { CREATED, SuccessResponse } from "../core/success.response.js";
import { createDiscountCodes, findAllDiscountCodesByShop, getAllDiscountCodeWithProduct, getDiscountAmount } from "../services/discount.service.js";

class DiscountController {
    createDiscount = async (req, res, next) => {
        new CREATED({
            message: 'Create discount success',
            metadata: await createDiscountCodes({
                shopId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }

    findAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all discount code by shop success",
            metadata: await findAllDiscountCodesByShop({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful discount amount!",
            metadata: await getDiscountAmount({ ...req.body })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Success Discount Codes With Products!",
            metadata: await getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

export default new DiscountController();