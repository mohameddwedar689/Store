const productController = require("../controllers/product.controller")

async function productRoutes(fastify , option ) {
    fastify.get("/" , productController.getProducts);
    fastify.get("/:id" , productController.getProductById);
    fastify.post("/add" , productController.createProduct);
    fastify.put("/update/:id" , productController.updateProduct);
    fastify.delete("/:id" , productController.deleteProduct);
}

module.exports = productRoutes;