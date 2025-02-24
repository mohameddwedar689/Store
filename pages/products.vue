<script setup>
import { ref, onMounted, computed } from "vue";

const products = ref([]);
const categories = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const newProduct = ref({ name: "", picture: "", category_id: null });

const fetchProducts = async () => {
  products.value = await $fetch("/api/products");
};

const fetchCategories = async () => {
  categories.value = await $fetch("/api/categories");
};

const addNewProduct = () => {
  newProduct.value = { name: "", picture: "", category_id: null };
  isEditing.value = false;
  showModal.value = true;
};

const editProduct = (product) => {
  newProduct.value = { ...product };
  isEditing.value = true;
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    if (isEditing.value) {
      // Now we pass the ID in the URL
      await $fetch(`/api/products/${newProduct.value.id}`, {
        method: "PUT",
        body: newProduct.value,
      });
    } else {
      await $fetch("/api/products", {
        method: "POST",
        body: newProduct.value,
      });
    }

    await fetchProducts(); // Refresh product list
    showModal.value = false;
  } catch (error) {
    console.error("Error saving product:", error);
  }
};

const deleteProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmDelete) return;
  await $fetch("/api/products", { method: "DELETE", body: { id } });
  fetchProducts();
};

const categoryTree = computed(() => {
  return categories.value.map((category) => {
    return {
      ...category,
      products: products.value.filter(
        (product) => product.category_id === category.id
      ),
    };
  });
});

onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Products</h1>

    <div class="d-flex gap-2">
      <button class="btn btn-success mb-3" @click="addNewProduct">
        Add Product
      </button>
      <NuxtLink to="/categories" class="btn btn-primary mb-3 block">
        View Categories
      </NuxtLink>
    </div>

    <ul class="list-group">
      <li
        v-for="category in categoryTree"
        :key="category.id"
        class="list-group-item"
      >
        <strong>{{ category.name }}</strong>
        <ul class="list-group mt-2">
          <li
            v-for="product in category.products"
            :key="product.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{{ product.name }}</span>
            <div>
              <button
                class="btn btn-primary btn-sm me-2"
                @click="editProduct(product)"
              >
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteProduct(product.id)"
              >
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Vuetify Modal for Add/Edit Product -->
    <v-dialog v-model="showModal" max-width="400px">
      <v-card>
        <v-card-title>
          {{ isEditing ? "Edit Product" : "Add New Product" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newProduct.name"
            label="Product Name"
          ></v-text-field>
          <v-text-field
            v-model="newProduct.picture"
            label="Picture URL"
          ></v-text-field>
          <v-select
            v-model="newProduct.category_id"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Category"
            variant="outlined"
            class="custom-select"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" @click="showModal = false">Cancel</v-btn>
          <v-btn color="green" @click="saveProduct">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.custom-select {
  width: 100%; /* Make it full width */
  max-width: 400px; /* Set a max width */
  margin-bottom: 16px; /* Add spacing below */
}
</style>
