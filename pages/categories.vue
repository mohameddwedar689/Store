<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const categories = ref([]);
const categoryTree = ref([]);
const parentCategories = ref([]);
const name = ref("");
const picture = ref("");
const parent_id = ref(null);
const loading = ref(false);
const errorMessage = ref("");
const selectedCategory = ref(null);
const newCategory = ref({ name: "", picture: "", parent_id: null });
const showModal = ref(false);
const isEditing = ref(false);
const allCategories = ref([]);
const expandedCategories = ref(new Set());
const hasSubmitted = ref(false)

const router = useRouter();

const navigateToTree = () => {
  router.push("/categories-tree"); 
};

// validation
const validateForm = () => {
  if (!hasSubmitted.value) return true;
  return newCategory.value.name.trim() !== "" && newCategory.value.picture !== "";
};


const flattenCategories = (categories) => {
  let flatList = [];
  for (const category of categories) {
    flatList.push(category);
    if (category.children && category.children.length > 0) {
      flatList = flatList.concat(flattenCategories(category.children));
    }
  }
  return flatList;
};

const fetchCategoryTree = async () => {
  const response = await $fetch("/api/categories/tree");
  categoryTree.value = response.data;
  parentCategories.value = [{ id: null, name: "None" }, ...flattenCategories(response.data)];
};

const fetchCategories = async () => {
  const response = await $fetch("/api/categories/tree");
  allCategories.value = flattenCategories(response.data);
};

// Toggle category visibility
const toggleCategory = (category) => {
  if (expandedCategories.value.has(category.id)) {
    expandedCategories.value.delete(category.id);
  } else {
    expandedCategories.value.add(category.id);
  }
};



// Fetch a single category by ID
const fetchCategoryById = async (id) => {
  try {
    selectedCategory.value = await $fetch(`/api/categories/${id}`);
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

// Add new category
// Save category (either add or update)
const saveCategory = async () => {
  hasSubmitted.value = true;
  if (!validateForm()) return;
  try {
    const categoryData = {
      name: newCategory.value.name?.trim() || "", // Ensure it's not empty
      picture: newCategory.value.picture || "",
      parent_id: newCategory.value.parent_id || null,
    };

    if (isEditing.value) {
      await $fetch(`/api/categories/${selectedCategory.value.id}`, {
        method: "PUT",
        body: categoryData,
      });
    } else {
      await $fetch(`/api/categories`, {
        method: "POST",
        body: categoryData,
      });
    }

    showModal.value = false;
    fetchCategoryTree(); // Refresh list
    fetchCategories();
  } catch (error) {
    if (error.data?.data) {
      alert("Validation Error: " + error.data.data.join("\n")); // Show validation errors
    } else {
      console.error("Error saving category:", error);
    }
  }
};


// Open modal for adding a new category
const addNewCategory = () => {
  newCategory.value = { name: "", picture: "", parent_id: null };
  isEditing.value = false;
  showModal.value = true;
  hasSubmitted.value = false;
};

// Update a category
const updateCategory = async () => {
  if (!selectedCategory.value) return;

  try {
    await $fetch(`/api/categories/${selectedCategory.value.id}`, {
      method: "PUT",
      body: {
        name: newCategoryName.value,
        picture: newCategoryPicture.value,
      },
    });
    fetchCategoryTree(); // Refresh list
    selectedCategory.value = null; // Clear selection
    fetchCategories();
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

// Open modal for editing an existing category
const editCategory = async (category) => {
  selectedCategory.value = { ...category };
  newCategory.value = { name: category.name, picture: category.picture };
  isEditing.value = true;
  showModal.value = true;
};

// Delete a category
const deleteCategory = async (id) => {
  if (!confirm("Are you sure you want to delete this category?")) return;

  try {
    await $fetch(`/api/categories/${id}`, { method: "DELETE" });

    // Remove from local state instantly
    allCategories.value = allCategories.value.filter((cat) => cat.id !== id);
    categoryTree.value = categoryTree.value.filter((cat) => cat.id !== id);
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return console.error("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await $fetch("/api/categories/upload", {
      method: "POST",
      body: formData,
    });


    if (response.success && response.filePath) {
  newCategory.value.picture = response.filePath; 
} else {
  console.error("Upload failed:", response.message);
}
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const getCategoryImage = (imagePath) => {
  if (!imagePath) return "public/upload/default-category.png";
  return `${imagePath}`; 
};



onMounted(() => {
  fetchCategoryTree();
  fetchCategories();
});
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Categories</h1>

    <div class="d-flex gap-2">
      <button class="btn btn-success mb-3 block" @click="addNewCategory">
        Add Category
      </button>

      <NuxtLink to="/products" class="btn btn-primary mb-3 block">
        View Products
      </NuxtLink>

      <button class="btn btn-secondary mb-3 ms-2" @click="navigateToTree">
        <i class="bi bi-diagram-3"></i> View Categories Tree
      </button>
    </div>

    <ul class="list-group">
      <li
        v-for="category in allCategories"
        :key="category.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex align-items-center gap-3">
      <!-- Category Image -->
      <img
        :src="getCategoryImage(category.picture)"
        alt="Category Image"
        class="rounded-circle"
        width="50"
        height="50"
      />

      <!-- Category Details -->
      <div>
        <strong>{{ category.name }}</strong>
        <p class="text-muted mb-0">({{ category.totalProductCount }} Products)</p>
      </div>
    </div>

        <div>
          <button
            class="btn btn-primary btn-sm me-2"
            @click="editCategory(category)"
          >
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button
            class="btn btn-danger btn-sm"
            @click="deleteCategory(category.id)"
          >
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </li>
    </ul>

    <!-- Vuetify Modal for Add/Edit Category -->
    <v-dialog v-model="showModal" max-width="400px">
      <v-card>
        <v-card-title>
          {{ isEditing ? "Edit Category" : "Add New Category" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newCategory.name"
            label="Category Name"
            :error="hasSubmitted && !newCategory.name.trim()"
          ></v-text-field>
          

          <v-file-input
            label="Picture URL"
            @change="uploadImage"
            class="w-100"
            prepend-icon=""
            :error="hasSubmitted && !newCategory.picture"
          />

          <v-select
            v-model="newCategory.parent_id"
            :items="parentCategories"
            item-title="name"
            item-value="id"
            label="Parent Category"
          ></v-select>

          <p v-if="hasSubmitted && !newCategory.name" class="text-danger">Please add the category name before submitting.</p>
          <p v-if="hasSubmitted && !newCategory.picture" class="text-danger">Please upload the image before submitting.</p>


        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" @click="showModal = false">Cancel</v-btn>
          <v-btn color="green" @click="saveCategory">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
