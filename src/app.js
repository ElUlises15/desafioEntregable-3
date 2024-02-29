const express = require("express");
const ProductManager = require("./ProductManager");
const path = require("path");

const app = express();
const PORT = 3001;

// Ruta al archivo products.json
const productsFilePath = path.join(__dirname, "products.json");

// Endpoint GET '/products'
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit; // Obtener query param 'limit'
    const manager = new ProductManager(productsFilePath);
    console.log("Cargando productos desde:", productsFilePath); // Registro de consola
    let products = await manager.getProducts(); // Obtener productos

    // Aplicar límite si fue proveído
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GET '/products/:pid'
app.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid; // Obtener param pid
    const manager = new ProductManager(productsFilePath);
    const product = await manager.getProductById(pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
