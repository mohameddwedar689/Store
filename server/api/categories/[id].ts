import { PrismaClient } from "@prisma/client";
import {
  defineEventHandler,
  readBody,
  H3Event,
  sendError,
  createError,
} from "h3";
import {validateGetCategory , validateDeleteCategory , validateUpdateCategory} from '../../validation/categorySchema'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = event.context.params?.id;

  if (!id) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "ID is required" })
    );
  }

  try {
    if (method === "GET") {
      await validateGetCategory(event)
      const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      });
      if (!category) throw new Error("Category not found");
      return category;
    }

    if (method === "PUT") {
      await validateUpdateCategory(event)
      const body = await readBody(event);
      const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: body,
      });
      return updatedCategory;
    }

    if (method === "DELETE") {
      await validateDeleteCategory(event)
      await prisma.category.delete({
        where: { id: Number(id) },
      });
      return { message: "Category deleted successfully" };
    }
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: (error as Error).message })
    );
  }
});
