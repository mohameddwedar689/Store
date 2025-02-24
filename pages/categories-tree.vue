<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const categoriesTree = ref([]);
const expandedCategories = ref({});
const categories = ref([]);

const fetchCategoriesTree = async () => {
  const response = await $fetch("/api/categories/tree");
  categories.value = response.data;
};

const toggleCategory = (id) => {
  expandedCategories.value[id] = !expandedCategories.value[id];
};

const goBack = () => {
  router.push("/categories");
};

onMounted(fetchCategoriesTree);
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Categories Tree</h1>
    <button class="btn btn-secondary mb-3" @click="goBack">
      <i class="bi bi-arrow-left"></i> Back to Categories
    </button>

    <ul class="list-group">
      <template v-for="category in categories" :key="category.id">
        <li class="list-group-item">
          <button
            class="btn btn-sm btn-outline-primary me-2"
            @click="toggleCategory(category.id)"
          >
            <i
              class="bi"
              :class="{
                'bi-caret-down-fill': expandedCategories[category.id],
                'bi-caret-right-fill': !expandedCategories[category.id],
              }"
            ></i>
          </button>
          {{ category.name }}
          <ul
            v-if="expandedCategories[category.id]"
            class="list-group mt-2 ms-4"
          >
            <li
              v-for="sub in category.children"
              :key="sub.id"
              class="list-group-item"
            >
              {{ sub.name }}
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>
