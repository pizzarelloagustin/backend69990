import { CommentsController } from "moongose/controller/index.js";
import CartModel from "../models/cart.model.js";

class CartManager {

    async addCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error creating cart", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                console.log("Cart not found");
                return null;
            }

            return cart;
        } catch (error) {
            console.error("Error getting cart:", error);
            throw error;
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                return {messege:"Cart not found"};
            }
            const product = cart.products.find(item => item.product._id.toString() === productId);

            if (product) {
                product.quantity += quantity;
            } else {
                cart.products.push({ product: { _id: productId }, quantity });
            }
            
            cart.markModified("products");
            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async addProducts(cartId, products) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                return {messege:"Cart not found"};
            }
            
            products.map((producto) => {
                cart.products.push(producto);
            })

            cart.markModified("products");
            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                return {messege:"Cart not found"};
            }

            const index = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (index === -1) return {messege:"Product in cart not found"};
            cart.products.splice(index,1)
            cart.markModified("products");
            await cart.save();
            return {messege:"Product in cart deleted"};

        } catch (error) {
            console.error("Error deleting product in cart", error);
            throw error;
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                return {messege:"Cart not found"};
            }

            cart.products.splice(0,cart.products.length);
            cart.markModified("products");
            await cart.save();
            return {messege:"All products in cart deleted"};

        } catch (error) {
            console.error("Error deleting all products in cart", error);
            throw error;
        }
    }
}

export default CartManager;