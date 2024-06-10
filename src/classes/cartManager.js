import fs from 'fs';

export default class CartManager {
    static id = 0; 

    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async addCart(products = []) {
        const newCart = {
            id: ++CartManager.id,
            products
        };

        this.carts.push(newCart);
        await this.saveFile(this.carts);
        return {messege:"Cart added"};
    }

    getProductsByCid(cid) {
        const productsCart = this.carts.find(cart => cart.id === cid);

        if (productsCart) {
            return productsCart.products;
        } else {
            return {messege:"Cart not found"};
        }
    }

    async addProduct(cid,pid,quantity) {
        let cartIndex = this.carts.findIndex(cart => cart.id === cid);
        if (cartIndex === -1) return {messege:"Cart not found"};

        if(!pid || !quantity) {
            return {messege:"Product ID and quantity are mandatory"};
        };

        let productIndex = this.carts[cartIndex].products.findIndex(product => product.pid === pid);
        if (productIndex === -1) {
            this.carts[cartIndex].products.push({pid:pid,quantity:quantity});
            await this.saveFile(this.carts);
            return {messege:"Product added"};
        } else {
            let q = this.carts[cartIndex].products[productIndex].quantity + quantity;
            this.carts[cartIndex].products[productIndex].quantity = q;
            await this.saveFile(this.carts);
            return {messege:"Product quantity updated"};
        };
    }

    async saveFile(arrayProducts) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    async getFile() {
        try {
            const res = await fs.promises.readFile(this.path, "utf-8");
            const array = JSON.parse(res);
            return array; 

        } catch (error) {
            console.log("Error: ", error);
        }
    }
}