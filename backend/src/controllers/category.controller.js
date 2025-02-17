const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getCategoriesTreeWithProductCount  = async (req , reply) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
        children: true
      }
    });

    const calculateProductCount = (category) => {
      let count = Array.isArray(category.products) ? category.products.length : 0;

      if (Array.isArray(category.children) && category.children.length > 0) {
        category.children = category.children.map(child => {
          const childCount = calculateProductCount(child);
          count += childCount;
          return { ...child, product_count: childCount }; 
        });
      }

      return count;
    };

    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => {
          const productCount = calculateProductCount(cat);
          return { 
            ...cat, 
            product_count: productCount, 
            children: buildTree(cat.id) 
          };
        });
    };

    const categoryTree = buildTree(null);
    reply.send(categoryTree);
  }
  catch(error) {
    console.error("Error fetching category tree:", error);
    reply.status(500).send({ message: "Internal Server Error" });
  }
}

const getCategoriesTree = async (req , reply) => {
  try {
    const categories = await prisma.category.findMany({
      include: {children: true}
    });

    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({...cat , children: buildTree(cat.id)}))
    };

    const categoryTree = buildTree(null)
    reply.send(categoryTree)
  }
  catch (error) {
    console.error("Error fetching category tree:", error);
    reply.status(500).send({ message: "Internal Server Error" });
  }
}

// GET: api to get all the categories 
const getAllCategories = async (req, reply) => {
    const categories = await prisma.category.findMany({ include: { children: true } });
    reply.send(categories);
};

// GET: api to get single category by id
const getCategoryById = async (req, reply) => {
    const { id } = req.params;
    const category = await prisma.category.findMany({ where: { id: Number(id) }, include: { children: true } });
    if (!category) 
        return reply.status(404).send({ message: "Category not found" });
    reply.send(category);
};

// create recursion category
const createCategoryWithChildren = async (categoryData, parentId = null) => {
    const { name, picture, children } = categoryData;
    const newCategory = await prisma.category.create({
      data: {
        name,
        picture,
        parent_id: parentId
      }
    });
    if (children && children.length > 0) {
    for (const child of children) {
      await createCategoryWithChildren(child, newCategory.id);
    }
    }
    return newCategory;
  };


// POST: api to create new category
const createCategory = async (req, reply) => {
  try {
    const categoryData = req.body;
    const newCategory = await createCategoryWithChildren(categoryData);
    reply.status(201).send({ message: "Category created successfully", newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    reply.status(500).send({ message: "Internal Server Error" });
  }
};


// PUT: api to update exist category
const updateCategory = async (req, reply) => {
    const { id } = req.params;
    const { name, picture, parent_id } = req.body;
    const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: { name, picture, parent_id },
    });
    reply.status(201).send(updatedCategory);
};

// DELETE: api to delete spasific category
const deleteCategory = async (req, reply) => {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: Number(id) } });
    reply.send({ message: "Category deleted" });
};

module.exports = {
    getAllCategories,
    getCategoriesTree,
    getCategoriesTreeWithProductCount,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}