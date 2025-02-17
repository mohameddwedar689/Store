<template>
    <div>
        <h1>Products</h1>
        <button @click="goToCreateProduct">Create New Product</button>
        <div v-if="products.length">
        <ul>
            <li v-for="product in products" :key="product.id">
            <h2>{{ product.name }}</h2>
            <p>{{ product.picture }}</p>
            <p>Category: {{ product.category.name }}</p>
            </li>
        </ul>
        </div>
        <div v-else>
        <p>No products found.</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        products: [],
        };
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        goToCreateProduct() {
            this.$router.push('/create-product');
        },
        async getProducts() {
        try {
            const response = await this.$axios.get('/products');
            this.products = response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        },
    },
};
</script>
