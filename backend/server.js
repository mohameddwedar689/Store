const Fastify =  require('fastify')
const {PrismaClient} = require('@prisma/client');
const categoryRoutes = require("./src/routes/category.routes");
const productRoutes = require("./src/routes/product.routes");

const app = Fastify({logger: true})
const prisma = new PrismaClient();

// Routes Registration
app.register(categoryRoutes , {prefix: "/categories"});
app.register(productRoutes , {prefix: "/products"});

const start = async () => {
    try {
        await app.listen({port: 4000 , host: '0.0.0.0'})
        console.log("server running on http://localhost:4000");
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();