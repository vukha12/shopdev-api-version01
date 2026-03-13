import express from "express";
import notiController from "../../controllers/notification.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = express.Router();

// authentication //
router.use(authenticationV2);

// CRUD product
router.get("", asyncHandler(notiController.listNotiByUser));
export default router;