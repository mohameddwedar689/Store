import { defineEventHandler, getRouterParam, readBody, createError } from "h3";
import { PrismaClient } from "@prisma/client";
import { validateUpdateProduct } from "../../validation/productSchema";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id"); 
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, message: "Product ID is required" });
  }

  if (event.method === "PUT") {
    await validateUpdateProduct(event)
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name: body.name,
          picture: body.picture,
          category_id: body.category_id,
        },
      });

      return updatedProduct;
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to update product",
      });
    }
  }
});
