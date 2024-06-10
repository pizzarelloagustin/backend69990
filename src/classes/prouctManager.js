import fs from 'fs';

export default class ProductManager {
    static id = 0; 

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, description, code, price, status = true, stock, category, thumbnails) {
        if(!title || !description || !code ||!price || !status || !stock || !category) {
            return {messege:"All fields are mandatory"};
        };
        
        const newProduct = {
            id: ++ProductManager.id,
            title, 
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        await this.saveFile(this.products);
        return {messege:"Product added"};
    }

    async updateProduct(pid, title, description, code, price, status, stock, category, thumbnails) {
        const product = this.getProductById(pid);
        if (JSON.stringify(product) === JSON.stringify({messege:"Product not found"})) return product;

        if(title) product.title = title;
        if(description) product.description = description;
        if(code) product.code = code;
        if(price) product.price = price;
        if(status) product.status = status;
        if(stock) product.stock = stock;
        if(category) product.category = category;
        if(thumbnails) product.thumbnails = thumbnails;
        
        let index = this.products.findIndex(p => p.id === pid);
        this.products[index] = product;

        await this.saveFile(this.products);
        return {messege:"Product updated", pid:pid};
    }

    async getProducts() {
        let arrayProducts = await this.getFile();
        return arrayProducts; 
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);

        if (product) {
            return product;
        } else {
            return {messege:"Product not found"};
        }
    }

    async deleteProduct(pid) {
        let index = this.products.findIndex(p => p.id === pid);
        if (index === -1) return {messege:"Product not found"};
        this.products.splice(index,1)
        await this.saveFile(this.products);
        return {messege:"Product deleted", pid:pid};
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