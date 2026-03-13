'use strict';

import { BadRequestError } from "../core/error.response.js";
import { SuccessResponse } from "../core/success.response.js";
import uploadImage from "../services/upload.service.js";

class UploadController {
    async uploadFile(req, res, next) {
        new SuccessResponse({
            message: 'Upload file successfully!',
            metadata: await uploadImage.uploadImageFromUrl()
        }).send(res);
    }

    async uploadFileThumb(req, res, next) {
        const { file } = req;
        if (!file) {
            throw new BadRequestError('File missing');
        }
        new SuccessResponse({
            message: 'Upload file local successfully!',
            metadata: await uploadImage.uploadImageFromLocal({
                path: file.path
            })
        }).send(res);
    }

    async uploadImageFromLocalFiles(req, res, next) {
        const { files } = req;
        if (!files.length) {
            throw new BadRequestError('File missing');
        }
        new SuccessResponse({
            message: 'Upload file local successfully!',
            metadata: await uploadImage.uploadImageFromLocalFiles({
                files,
                ...req.body
            })
        }).send(res);
    }

    // upload file local S3Client
    async uploadImageFromLocalS3(req, res, next) {
        const { file } = req;
        if (!file) {
            throw new BadRequestError('File missing');
        }
        new SuccessResponse({
            message: 'Upload file local successfully!',
            metadata: await uploadImage.uploadImageFromLocalS3({
                file
            })
        }).send(res);
    }
}

export default new UploadController();