import ProductModel from "../models/product.model.js";

class ProductManager {

    async addProduct({title, description, code, price, status, stock, category, thumbnails}) {
        try {

            if(!title || !description || !code ||!price || !status || !stock || !category) {
                return {messege:"All fields are mandatory"};
            };

            const productExist = await ProductModel.findOne({ code: code });

            if (productExist) {
                console.log("The code must be unique");
                return {messege:"The code must be unique"};
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    async getProducts({ limit, page, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error getting products:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("Product not found");
                return null;
            } else {
                return product;
            }
        } catch (error) {
            console.log("Error getting product:", error);
            throw error;
        }
    }

    async updateProduct(pid, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(pid, updatedProduct);
            if (!product) {
                console.log("Product not found");
                return {messege:"Product not found"};
            } else {
                return {messege:"Product updated"};
            }
        } catch (error) {
            console.log("Error updating:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deleted = await ProductModel.findByIdAndDelete(id); 
            if(!deleted) {
                return {messege:"Product not found"};
            } else {
                return {messege:"Product deleted"};
            }
        } catch (error) {
            console.log("Error deleting:", error);
            throw error;
        }
    }
}

export default ProductManager;