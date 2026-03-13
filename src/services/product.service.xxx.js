"use strict";

import { product, clothing, electronic, furniture } from "../models/product.model.js";
import {
    findAllDraftsForShop,
    findAllProducts,
    findAllPublishForShop,
    findProduct,
    publishProductByShop,
    searchProductByUser,
    unPublishProductByShop,
    updateProductById
} from "../models/repositories/product.repo.js";
import { BadRequestError } from "../core/error.response.js";
import { removeUndefinedObject, updateNestedObjectParer } from "../utils/index.js";
import { insertInventory } from "../models/repositories/inventory.repo.js";
import { pushNotificationSystem } from "./notification.service.js";


// define Factory class to create product
class ProductFactory {

    static productRegistry = {} // nơi chứa danh sách các loại sản phẩm 

    static registerProductType(tyle, classRef) {
        ProductFactory.productRegistry[tyle] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // END PUT //

    // query //
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts(
        { limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
    // end query //
}
// define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })

            // push noti to system collection
            pushNotificationSystem({
                type: 'SHOP-001',
                receiverId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            }).then(rs => console.log(rs))
                .catch(err => console.log(err))
        }

        return newProduct;
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({
            productId,
            bodyUpdate,
            model: product
        })
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError("Create clothing product failed")

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError("Create product failed")

        return newProduct
    }

    async updateProduct(productId) {

        // console.log(`[1]--`, this)
        const objectParams = removeUndefinedObject(this);
        // console.log(`[2]--`, objectParams)

        if (objectParams.product_attributes) {

            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParer(objectParams.product_attributes),
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParer(objectParams));
        return updateProduct
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError("Create clothing product failed")

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError("Create product failed")

        return newProduct
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {

    async createProduct() {
        const newfurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newfurniture) throw new BadRequestError("Create clothing product failed")

        const newProduct = await super.createProduct(newfurniture._id)
        if (!newProduct) throw new BadRequestError("Create product failed")

        return newProduct
    }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

export default ProductFactory;