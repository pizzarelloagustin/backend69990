import { Router } from "express";
const router = Router();
import ProductManager from "../controllers/prouctManager.js";

const managerProducts = new ProductManager("./src/models/products.json");

router.get("/", (req, res) => {
    const products = async () => {
        let limit = parseInt(req.query.limit);
        let array = await managerProducts.getProducts();
        if (!limit) return res.json(array);
        return res.json(array.slice(0,limit));
    }
    products();
});


router.get("/:id", (req, res) => {
    const searchProduct = async () => {
        let id = parseInt(req.params.id);
        let product = await managerProducts.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.json({messege:"Product not found"})
        }
    }
    searchProduct();
});


router.post("/", (req, res) => {
    const add = async () => {
        let { title, description, code, price, status, stock, category, thumbnails} = req.body;
        let product = await managerProducts.addProduct(title, description, code, price, status, stock, category, thumbnails);
        return res.json(product);
    };
    add();
});

router.put("/:pid", (req, res) => {
    const update = async () => {
        let pid = parseInt(req.params.pid);
        let { title, description, code, price, status, stock, category, thumbnails} = req.body;
        let product = await managerProducts.updateProduct(pid, title, description, code, price, status, stock, category, thumbnails);
        res.json(product);
    };
    update();
});

router.delete("/:pid", (req, res) => {
    const del = async () => {
        let pid = parseInt(req.params.pid);
        let product = await managerProducts.deleteProduct(pid);
        res.json(product);
    };
    del();
});

export default router; 