import { Router } from "express";
const router = Router(); 
import CartModel from "../dao/models/cart.model.js";
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart);
    } catch (error) {
        console.log("Error creating cart", error);
        res.status(500).json({ error: "Error creating cart" });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId)
        if (!cart) {
            return res.json({ error: "Cart not found" });
        }
        return res.json(cart.products);
    } catch (error) {
        console.error("Error getting cart", error);
        res.status(500).json({ error: "Error getting cart" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1;
    try {
        const updateCart = await cartManager.addProduct(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error adding/updating product", error);
        res.status(500).json({ error: "Error adding/updating product" });
    }
});

export default router; 