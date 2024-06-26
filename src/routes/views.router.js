import { Router } from "express";
const router = Router(); 
import ProductManager from "../controllers/prouctManager.js";

const managerProducts = new ProductManager("./src/models/products.json");

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
})

router.get("/", async (req, res) => {
    try {
        const products = await managerProducts.getProducts(); 
        res.render("home", {products})
    } catch (error) {
        res.status(500).send("Something went wrong..."); 
    }
})

export default router;