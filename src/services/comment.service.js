'use strict'

import { NotFoundError } from "../core/error.response.js";
import commentModel from "../models/comment.model.js";
import { findProduct } from "../models/repositories/product.repo.js"
/*
    key features: Comment service
    
*/
class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null }) {
        const foundProduct = await this.checkProductExist(productId);
        if (!foundProduct) throw new NotFoundError('product not found')

        const comment = new commentModel({
            comment_userId: userId,
            comment_productId: productId,
            comment_content: content,
            comment_parentId: parentCommentId,
        })

        let rightValue;
        if (parentCommentId) {

            const parentComment = await commentModel.findById(parentCommentId).lean();
            if (!parentComment) throw new NotFoundError("parent comment not found")

            rightValue = parentComment.comment_right;

            // updateMany comment
            await commentModel.updateMany({
                comment_productId: productId,
                comment_right: { $gte: rightValue }
            }, { $inc: { comment_right: 2 } })

            await commentModel.updateMany({
                comment_productId: productId,
                comment_left: { $gt: rightValue }
            }, { $inc: { comment_left: 2 } })

        } else {
            const maxRightValue = await commentModel.findOne(
                { comment_productId: productId },
                'comment_right',
                { sort: { comment_right: -1 } }
            )
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError("Not found comment for product")

            const comments = await commentModel.find({
                comment_productId: productId,
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right },
                isDeleted: false
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await commentModel.find({
            comment_productId: productId,
            comment_parentId: null,
            isDeleted: false
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static async deleteComment({ commentId, productId }) {
        const foundProduct = await this.checkProductExist(productId);
        if (!foundProduct) throw new NotFoundError('product not found')

        // soft delete

        // found comment
        const comment = await commentModel.findById(commentId);
        if (!comment) throw new NotFoundError('comment not found')

        // check comment by product
        if (comment.comment_productId.toString() !== productId) {
            throw new Error('Comment does not belong to this product');
        }

        const commentAndReplies = await commentModel.updateMany({
            comment_productId: productId,
            comment_left: { $gte: comment.comment_left },
            comment_right: { $lte: comment.comment_right },
            isDeleted: false
        }, {
            $set: { isDeleted: true }
        })

        return true;
    }

    static async checkProductExist(productId) {
        return await findProduct({ product_id: productId })
    }
}

export default CommentService;