import {
  defineEventHandler,
  readBody,
  H3Event,
  sendError,
  createError,
} from "h3";
import { PrismaClient } from "@prisma/client";
import { validateCreateCategory, validateGetCategory} from "../../validation/categorySchema";

import * as yup from "yup";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
      //await validateGetCategory(event)
      return await prisma.category.findMany({
        include: { children: true, products: true },
      });
    }

    if (method === "POST") {
      const body = await readBody(event);

      // validation
      await validateCreateCategory(event)

      const { name, picture, parent_id } = body;

      if (!name || typeof name !== "string") {
        return sendError(event, createError({ statusCode: 400, statusMessage: "Category name is required and must be a string" }));
      }

      const newCategory = await prisma.category.create({
        data: {
          name,
          picture: picture || "",
          parent_id
        },
      });
      return newCategory;
    }
  } catch (error) {
    
      if (error instanceof yup.ValidationError) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: "Validation Error",
            data: error.errors,
          })
        );
      }
      return sendError(
        event,
        createError({ statusCode: 500, statusMessage: (error as Error).message })
      );

  }
});
