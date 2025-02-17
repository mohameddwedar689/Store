<template>
    <div>
        <h1>Categories</h1>
        <div v-if="categories.length">
        <ul>
            <li v-for="category in categories" :key="category.id">
            <h2>{{ category.name }}</h2>
            <p>{{ category.picture }}</p>
            <p>Products: {{ category.product_count }}</p>
            <button @click="deleteCategory(category.id)">Delete</button>
            </li>
        </ul>
        </div>
        <div v-else>
        <p>No categories found.</p>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
        categories: [],
        };
    },
    mounted() {
        this.getCategories();
    },
    methods: {
        async getCategories() {
        try {
            const response = await this.$axios.get('/categories');
            this.categories = response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        },
        async deleteCategory(id) {
        try {
            await this.$axios.delete(`/categories/delete/${id}`);
            this.categories = this.categories.filter(cat => cat.id !== id);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
        },
    },
};
</script>