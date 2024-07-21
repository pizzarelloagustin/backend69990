import { Router } from "express";
const router = Router();
import ProductManager from "../dao/db/product-manager-db.js";
const productManager = new ProductManager();


router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Error getting products"
        });
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({
                error: "Product not found"
            });
        }
        res.json(product);
    } catch (error) {
        console.error("Error getting product", error);
        res.status(500).json({
            error: "Error getting product"
        });
    }
});

router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        const product = await productManager.addProduct(newProduct);
        res.status(201).json(product);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            error: "Error adding product"
        });
    }
});

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;

    try {
        const product = await productManager.updateProduct(pid, updatedProduct);
        res.json(product);
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({
            error: "Error updating product"
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.deleteProduct(pid);
        res.json(product);
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({
            error: "Error deleting product"
        });
    }
});

export default router; 