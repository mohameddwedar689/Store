const Fastify =  require('fastify')
const {PrismaClient} = require('@prisma/client');

const fastify = Fastify({logger: true})
const prisma = new PrismaClient();

fastify.get('/' , async (request , reply) => {
    return {message: "hello from fastify api project"};
})

fastify.get('/users' , async (request , reply) => {
    const users = await prisma.user.findMany();
    return users;
})

const start = async () => {
    try {
        await fastify.listen({port: 4000 , host: '0.0.0.0'})
        console.log("Fastify server running on http://localhost:4000");
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();