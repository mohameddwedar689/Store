const categoryController = require("../controllers/category.controller");

async function categoryRoutes(fastify , option ) {
    fastify.get("/", categoryController.getAllCategories);
    fastify.get("/:id", categoryController.getCategoryById);
    fastify.get("/tree", categoryController.getCategoriesTree);
    fastify.get("/treeCount", categoryController.getCategoriesTreeWithProductCount);
    fastify.post("/add", categoryController.createCategory);
    fastify.put("/update/:id", categoryController.updateCategory);
    fastify.delete("/:id", categoryController.deleteCategory);
}

module.exports = categoryRoutes;