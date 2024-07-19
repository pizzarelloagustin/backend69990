import { Router } from "express";
const router = Router();
import ProductManager from "../dao/db/product-manager-db.js";
const productManager = new ProductManager();
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const productsArray = products.docs.map((producto) => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("products", {
            products: productsArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        });
    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: "error",
            error: "Error getting products",
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getProductsByCid(cartId);

        if (!cart) {
            console.log("Cart does not exist");
            return res.status(404).json({ error: "Cart not found" });
        }

        const productsCart = cart.products.map((item) => ({
            product: item.product.toObject(),
            quantity: item.quantity,
        }));

        res.render("carts", { products: productsCart });
    } catch (error) {
        console.error("Error getting cart", error);
        res.status(500).json({ error: "Error getting cart" });
    }
});

export default router;
