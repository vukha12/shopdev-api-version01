'use strict';

import ProductService from "../services/product.service.xxx.js";
import { SuccessResponse } from "../core/success.response.js";

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    // update Product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Product success!',
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            }
            )
        }).send(res);
    }


    // PUT //
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product success!",
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Un Publish product success!",
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res);
    }
    // END PUT //

    // QUERY //
    /**
     * @desc Get all drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @returns {JSON} 
     */
    findAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list drafts for shop success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    findAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish for shop success!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    findLishSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product for shop success!',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list product success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }

    findProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product detail success!',
            metadata: await ProductService.findProduct({ product_id: req.params.product_id })
        }).send(res);
    }
    // ENDQUERY //

}

export default new ProductController();