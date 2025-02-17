<template>
    <div>
        <h1>Create New Product</h1>
        <form @submit.prevent="createProduct">
        <!-- Name input -->
        <div>
            <label for="name">Name:</label>
            <input v-model="name" id="name" type="text" required placeholder="Enter product name" />
        </div>

        <!-- Picture input -->
        <div>
            <label for="picture">Picture:</label>
            <input v-model="picture" id="picture" type="text" required placeholder="Enter product image URL" />
        </div>

        <!-- Category dropdown -->
        <div>
            <label for="category_id">Category:</label>
            <select v-model="category_id" id="category_id" required>
            <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
            </option>
            </select>
        </div>

        <!-- Submit Button -->
        <div>
            <button type="submit">Create Product</button>
        </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
        name: '',          // product name
        picture: '',       // product picture URL
        category_id: '',   // selected category ID
        categories: [],    // list of available categories
        };
    },
    mounted() {
        // Fetch categories when the page loads
        this.getCategories();
    },
    methods: {
        async getCategories() {
        try {
            const response = await this.$axios.get('/categories');  // GET request to fetch categories
            this.categories = response.data;                        // Store categories in the state
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        },
        async createProduct() {
        const newProduct = {
            name: this.name,
            picture: this.picture,
            category_id: this.category_id,
        };

        try {
            // POST request to create a new product
            await this.$axios.post('/products', newProduct);
            // After success, redirect to the products list page
            this.$router.push('/products');
        } catch (error) {
            console.error("Error creating product:", error);
        }
        },
    },
};
</script>

<style scoped>
/* Add some basic styling for the form */
form {
display: flex;
flex-direction: column;
max-width: 400px;
margin: 0 auto;
}

div {
margin-bottom: 10px;
}

button {
padding: 10px;
background-color: #007bff;
color: white;
border: none;
cursor: pointer;
}

button:hover {
background-color: #0056b3;
}
</style>
