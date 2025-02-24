import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody, sendError, createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  try {
    if (method === "GET") {
      const products = await prisma.product.findMany({
        include: { category: true },
      });
      return products;
    } else if (method === "POST") {
      const body = await readBody(event);
      const newProduct = await prisma.product.create({ data: body });
      return newProduct;
    } else if (method === "DELETE") {
      const body = await readBody(event);
      if (!body.id)
        throw createError({
          statusCode: 400,
          statusMessage: "Product ID is required",
        });
      await prisma.product.delete({ where: { id: body.id } });
      return { message: "Product deleted successfully" };
    }
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: (error as Error).message })
    );
  }
});
