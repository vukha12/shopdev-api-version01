"use strict";

import Router from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import uploadController from "../../controllers/upload.controller.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import { uploadDisk, uploadMemory } from "../../configs/multer.config.js";

const router = Router()

// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb));
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles));

// upload s3
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalS3))

export default router;