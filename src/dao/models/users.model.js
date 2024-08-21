import mongoose from "mongoose";
import CartManager from "../db/cart-manager-db.js";
const cartManager = new CartManager();

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    age: {
        type: Number, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    cart: {
        type: String, 
        default: await cartManager.addCart()
    },
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

//const UserModel = mongoose.models.users || mongoose.model("users", userSchema); 
// Profe aca si uso el modelo users no me toma bien los datos, se ve que entra en conflicto con la default que crea mongodb, no se como desactivarla
const UserModel = mongoose.model("webUsers", userSchema); 

export default UserModel;