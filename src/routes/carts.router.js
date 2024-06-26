import { Router } from "express";
const router = Router(); 
import CartManager from "../controllers/cartManager.js";

const managerCart = new CartManager("./src/models/carts.json");

// Carrito prueba
// addProduct(products)

const testCart = async () => {
    await managerCart.addCart([{pid:11,quantity:11},{pid:12,quantity:12}]);
    await managerCart.addCart([{pid:23,quantity:23},{pid:24,quantity:24}]);
    await managerCart.addCart([{pid:35,quantity:35},{pid:36,quantity:36}]);
}
testCart();

router.post("/", (req, res) => {
    const add = async () => {
        let cart = await managerCart.addCart();
        return res.json(cart);
    }
    add();
})

router.get("/:cid", (req, res) => {
    const searchCart = async () => {
        let cid = parseInt(req.params.cid);
        let products = await managerCart.getProductsByCid(cid);
        return res.json(products);
    }
    searchCart();
});

router.post("/:cid/product/:pid", (req, res) => {
    const add = async () => {
        let cid = parseInt(req.params.cid);
        let pid = parseInt(req.params.pid);
        let { quantity } = req.body;
        let q = parseInt(quantity);
        let product = await managerCart.addProduct(cid,pid,q);
        return res.json(product);
    }
    add();
})

export default router; 