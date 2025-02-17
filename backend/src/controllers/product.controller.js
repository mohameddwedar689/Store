const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getProducts = async (req, reply) => {
    try {
    const products = await prisma.product.findMany({
        include: { category: true } 
    });
    reply.send(products);
    } catch (error) {
    console.error("Error fetching products:", error);
    reply.status(500).send({ message: "Internal Server Error" });
    }
};

const getProductById = async (req, reply) => {
    const { id } = req.params;
    try {
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { category: true }
    });
    if (!product) {
        return reply.status(404).send({ message: "Product not found" });
    }
    reply.send(product);
    } catch (error) {
    console.error("Error fetching product:", error);
    reply.status(500).send({ message: "Internal Server Error" });
    }
};

const updateProduct = async (req, reply) => {
    const { id } = req.params;
    const { name, picture, category_id } = req.body;
    try {
    const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
        name,
        picture,
        category_id
        }
    });
    reply.send({ message: 'Product updated', product });
    } catch (error) {
    console.error("Error updating product:", error);
    reply.status(500).send({ message: "Internal Server Error" });
    }
};


const createProduct = async (req, reply) => {
    const { name, picture, category_id } = req.body;
    try {
    const product = await prisma.product.create({
        data: {
        name,
        picture,
        category_id
        }
    });
    reply.status(201).send({ message: 'Product created', product });
    } catch (error) {
    console.error("Error creating product:", error);
    reply.status(500).send({ message: "Internal Server Error" });
    }
};

const deleteProduct = async (req, reply) => {
    const { id } = req.params;
    try {
    await prisma.product.delete({
        where: { id: Number(id) }
    });
    reply.send({ message: "Product deleted" });
    } catch (error) {
    console.error("Error deleting product:", error);
    reply.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct
}