'use strict';

import { SuccessResponse } from "../core/success.response.js";
import { listNotiByUser } from "../services/notification.service.js";

class NotificationController {

    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new listNotiByUser',
            metadata: await listNotiByUser(req.query)
        }).send(res)
    }
}

export default new NotificationController();