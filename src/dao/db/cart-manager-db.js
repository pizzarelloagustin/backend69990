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

    async getProductsByCid(cartId) {
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
            const cart = await this.getProductsByCid(cartId);
            const product = cart.products.find(item => item.product === productId)

            if (product) {
                product.quantity += quantity;
            } else {
                product.products.push({ product: productId, quantity });
            }

            cart.markModified("products");
            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}

export default CartManager;