import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express(); 
const PORT = 8080; 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 


app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`server listening: ${PORT}`);
}) 

import ProductManager from "../src/controllers/prouctManager.js";
const productManager = new ProductManager("./src/models/products.json");

// Producto prueba
// addProduct(title, description, code, price, status, stock, category, thumbnails)

const testProduct = async () => {
    await productManager.addProduct("yerba","para el mate","1",10,true,1,"almacen",["img11","img12"]);
    await productManager.addProduct("azucar","para endulzar","2",20,true,2,"almacen",["img21","img22"]);
    await productManager.addProduct("te","en hebras","3",30,true,3,"almacen",["img31","img32"]);
}
testProduct();

const io = new Server(httpServer); 


io.on("connection", async (socket) => {
    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getProducts());
    })

    socket.on("addProduct", async (product) => {
        let { title, description, code, price, status, stock, category, thumbnails} = product;
        await productManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
        io.sockets.emit("products", await productManager.getProducts());
    })
})