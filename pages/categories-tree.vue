<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const categoriesTree = ref([]);
const expandedCategories = ref({});
const categories = ref([]);

const fetchCategoriesTree = async () => {
  const response = await $fetch("/api/categories/tree");
  categoriesTree.value = response.data;
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

    <!-- Render Recursive Categories -->
    <ul class="list-group">
      <template v-for="category in categoriesTree" :key="category.id">
        <li class="list-group-item">
          <div class="d-flex align-items-center">
            <!-- Toggle Button -->
            <button
              v-if="category.children && category.children.length > 0"
              class="btn btn-sm btn-outline-primary me-2"
              @click="toggleCategory(category.id)"
            >
              <i class="bi" :class="expandedCategories[category.id] ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
            </button>

            <!-- Category Name -->
            <span class="fw-bold">{{ category.name }}</span>
          </div>

          <!-- Recursive Child Categories -->
          <ul v-if="expandedCategories[category.id]" class="list-group mt-2 ms-4">
            <template v-for="sub in category.children" :key="sub.id">
              <li class="list-group-item">
                <div class="d-flex align-items-center">
                  <!-- Toggle Button for Subcategories -->
                  <button
                    v-if="sub.children && sub.children.length > 0"
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="toggleCategory(sub.id)"
                  >
                    <i class="bi" :class="expandedCategories[sub.id] ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
                  </button>

                  <!-- Subcategory Name -->
                  <span>{{ sub.name }}</span>
                </div>

                <!-- Recursive Nested Categories -->
                <ul v-if="expandedCategories[sub.id]" class="list-group mt-2 ms-4">
                  <template v-for="child in sub.children" :key="child.id">
                    <li class="list-group-item">
                      <div class="d-flex align-items-center">
                        <!-- Toggle Button for Deeper Levels -->
                        <button
                          v-if="child.children && child.children.length > 0"
                          class="btn btn-sm btn-outline-primary me-2"
                          @click="toggleCategory(child.id)"
                        >
                          <i class="bi" :class="expandedCategories[child.id] ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
                        </button>

                        <!-- Child Name -->
                        <span>{{ child.name }}</span>
                      </div>

                      <!-- Further Nested Categories -->
                      <ul v-if="expandedCategories[child.id]" class="list-group mt-2 ms-4">
                        <template v-for="grandchild in child.children" :key="grandchild.id">
                          <li class="list-group-item">
                            <div class="d-flex align-items-center">
                              <!-- Toggle Button for Even Deeper Levels -->
                              <button
                                v-if="grandchild.children && grandchild.children.length > 0"
                                class="btn btn-sm btn-outline-primary me-2"
                                @click="toggleCategory(grandchild.id)"
                              >
                                <i class="bi" :class="expandedCategories[grandchild.id] ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
                              </button>

                              <!-- Grandchild Name -->
                              <span>{{ grandchild.name }}</span>
                            </div>
                          </li>
                        </template>
                      </ul>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
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
