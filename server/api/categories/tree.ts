import { PrismaClient, Category } from "@prisma/client";
import {
  defineEventHandler,
  readBody,
  H3Event,
  sendError,
  createError,
} from "h3";
const prisma = new PrismaClient();

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  children: Category[];
  products?: { id: number; name: string }[];
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Fetch all categories with their children
    const categories = await prisma.category.findMany({
      where: { parent_id: null }, // Start from top-level categories
  include: {
    children: {
      include: {
        children: { include: { children: true } }, // Recursively fetch children
        products: true, // Include products for each category
      },
    },
    products: true, // Include products for each category
  },
    });

    const countProductsRecursively = (category: Category): number => {
      let count = category.products ? category.products.length : 0;
      
      for (const child of category.children || []) {
        count += countProductsRecursively(child);
      }
    
      return count;
    };

    const buildTree = (
      categories: Category[],
      parentId: number | null = null
    ): Category[] => {
      return categories.map((cat) => ({
        ...cat,
        totalProductCount: countProductsRecursively(cat),
        children: buildTree(cat.children || []), // ✅ Use Prisma’s fetched children
      }));
    };
    return { success: true, data: buildTree(categories) };
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: (error as Error).message })
    );
  }
});
