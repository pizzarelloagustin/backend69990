import express from "express";
import { engine } from "express-handlebars";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import sessionRouter from "./routes/session.router.js";
import viewsRouter from "./routes/views.router.js";
import "./database.js";

const app = express(); 
const PORT = 8080; 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cookieParser()); 
app.use(passport.initialize()); 
initializePassport();

app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 


app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`server listening: ${PORT}`);
}) 