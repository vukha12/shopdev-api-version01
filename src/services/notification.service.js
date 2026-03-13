'use strict';
import notiModel from "../models/notification.model.js";

const pushNotificationSystem = async ({
    type = 'SHOP-001',
    receiverId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content;

    if (type === 'SHOP-001') {
        noti_content = `@@@ Vừa mới thêm một sản phẩm mới: @@@`
    } else if (type === 'PROMOTION-001') {
        noti_content = `@@@ Vừa mới có một chương trình khuyến mãi mới: @@@`
    }

    const newNoti = await notiModel.create({
        noti_type: type,
        noti_content,
        noti_receiverId: receiverId,
        noti_senderId: senderId,
        noti_options: options
    })

    return newNoti;
}

const listNotiByUser = async ({
    userId = 1,
    type = "ALL",
    isRead = 0
}) => {
    const match = { noti_receiverId: userId }
    if (type !== "ALL") {
        match['noti_type'] = type
    }

    return await notiModel.aggregate([
        { $match: match },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        { $substr: ['$noti_options.shop_name', 0, -1] },
                        'vừa mới thêm sản phẩm mới: ',
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        }
                    ]
                },
                createAt: 1,
                noti_options: 1
            }
        }])
}

export {
    pushNotificationSystem,
    listNotiByUser
}