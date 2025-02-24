# Store

This project is a full-stack web application designed to manage products and categories. It utilizes the following technologies:

- **Frontend**: [Nuxt 3](https://nuxt.com/) with [Bootstrap](https://getbootstrap.com/) and [Vuetify](https://vuetifyjs.com/)
- **Backend**: [Prisma](https://www.prisma.io/) ORM with [MySQL](https://www.mysql.com/)

## Features

- **Product Management**: Create, read, update, and delete products.
- **Category Management**: Manage product categories with parent-child relationships.
- **User Interface**: Responsive design using Bootstrap and Vuetify components.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MySQL](https://www.mysql.com/) (version 5.7 or higher)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mohameddwedar689/Store.git
   cd Store
   ```
2. **Install Dependencies**:
```bash
npm install
```

3. **Install Dependencies**:
    1. Environment Variables:
    Create a .env file in the root directory and add the following variables:
    ```bash
    DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
    ```
    2. Prisma Configuration:
    The Prisma schema is located at `prisma/schema.prisma`. Ensure it matches your database setup.
    3. Database Migration:
    After configuring your database, run:
    ```bash
    npx prisma migrate dev --name init
    ```
    4. Running the Application:
    ```bash
    npm run dev
    ```

## API Documentation

### Categories
- **GET** `/api/categories` – Find all categories.
- **GET** `/api/categories/:categoryId` – Find a specific category by ID.
- **GET** `/api/categories/tree` – Retrieve all categories as a tree structure.
- **POST** `/api/categories` – Create a new category.
- **PUT** `/api/categories/:categoryId` – Update an existing category by ID.
- **DELETE** `/api/categories/:categoryId` – Delete a category by ID.

### Products
- **GET** `/api/products` – Find all products.
- **GET** `/api/products/:productId` – Find a specific product by ID.
- **POST** `/api/products` – Create a new product.
- **PUT** `/api/products/:productId` – Update an existing product by ID.
- **DELETE** `/api/products/:productId` – Delete a product by ID.

### Image Upload
- **POST** `/api/upload` – Upload and resize an image to 3200x3200 pixels.

This structure keeps it clean and easy to read. Let me know if you want to add anything! 🚀

