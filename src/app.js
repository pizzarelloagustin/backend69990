import express from "express";
const app = express(); 
const PORT = 8080; 
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
    console.log(`server listening: ${PORT}`);
}) 