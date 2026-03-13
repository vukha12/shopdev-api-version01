import express from "express";
import productController from "../../controllers/product.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = express.Router();


router.get("/search/:keySearch", asyncHandler(productController.findLishSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProductById));

// authentication //
router.use(authenticationV2);

// CRUD product
router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.put("/publish/:id", asyncHandler(productController.publishProductByShop));
router.put("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

// QUERY //
router.get("/drafts/all", asyncHandler(productController.findAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.findAllPublishForShop));

export default router;