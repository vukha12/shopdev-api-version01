'use strict'

import { SuccessResponse } from "../core/success.response.js"
import CommentService from "../services/comment.service.js"

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.deleteComment(req.query)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }
}

export default new CommentController()