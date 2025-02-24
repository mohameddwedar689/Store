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
      include: {
        products: true, // Include products for each category
      },
    });

    const countProductsRecursively = (
      category: Category,
      allCategories: Category[]
    ): number => {
      let count = category.products ? category.products.length : 0;

      // Find children categories and count their products
      const children = allCategories.filter(
        (cat) => cat.parent_id === category.id
      );
      for (const child of children) {
        count += countProductsRecursively(child, allCategories);
      }

      return count;
    };

    const buildTree = (
      categories: Category[],
      parentId: number | null = null
    ): Category[] => {
      return categories
        .filter((cat) => cat.parent_id === parentId) // Find direct children
        .map((cat) => {
          const children = buildTree(categories, cat.id); // Recursively find children

          return {
            ...cat,
            children, // Attach the correct children
            totalProductCount: countProductsRecursively(cat, categories), // Ensure product counting is correct
          };
        });
    };
    return { success: true, data: buildTree(categories) };
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: (error as Error).message })
    );
  }
});
