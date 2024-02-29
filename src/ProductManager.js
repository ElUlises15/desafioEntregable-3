const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class Product {
  constructor(id, title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // Si hay un error al cargar desde el archivo, retornar un arreglo vacío
      return [];
    }
  }

  async saveProductsToFile(products) {
    const data = JSON.stringify(products, null, 2);
    await fs.writeFile(this.path, data);
  }

  async getProducts() {
    const products = await this.loadProductsFromFile();
    return products;
  }

  async addProduct(productData) {
    const products = await this.loadProductsFromFile();

    const newProduct = new Product(
      this.generateUniqueId(products),
      ...productData
    );
    products.push(newProduct);

    await this.saveProductsToFile(products);
    return newProduct.id;
  }

  async getProductById(productId) {
    const products = await this.loadProductsFromFile();
    const product = products.find((product) => product.id === productId);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }

  async updateProduct(productId, updatedFields) {
    let products = await this.loadProductsFromFile();
    const index = products.findIndex((product) => product.id === productId);
    if (index === -1) {
      throw new Error(`Producto con ID ${productId} no encontrado.`);
    }
    products[index] = { ...products[index], ...updatedFields };
    await this.saveProductsToFile(products);
  }

  async deleteProduct(productId) {
    let products = await this.loadProductsFromFile();
    const index = products.findIndex((product) => product.id === productId);
    if (index === -1) {
      throw new Error("Producto no encontrado.");
    }
    products.splice(index, 1);
    await this.saveProductsToFile(products);
  }

  generateUniqueId(products) {
    let id;
    do {
      id = uuidv4();
    } while (products.some((product) => product.id === id));
    return id;
  }
}

module.exports = ProductManager;
