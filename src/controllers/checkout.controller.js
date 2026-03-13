'use strict';

import CheckoutService from "../services/checkout.service.js"
import { SuccessResponse } from "../core/success.response.js"

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new Cart success!",
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res);
    }


}

export default new CheckoutController();