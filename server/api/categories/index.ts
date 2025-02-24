import {
  defineEventHandler,
  readBody,
  H3Event,
  sendError,
  createError,
} from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
      return await prisma.category.findMany({
        include: { children: true, products: true },
      });
    }

    if (method === "POST") {
      const body = await readBody(event);
      const { name, picture, parent_id } = body;

      const newCategory = await prisma.category.create({
        data: { name, picture, parent_id },
      });
      return newCategory;
    }
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: (error as Error).message })
    );
  }
});
