<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Gestion des Produits</h1>
    <button @click="openAddModal" class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Ajouter un produit
    </button>
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marque</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ product.id }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ product.name }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ product.description }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ product.price }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ product.brand }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ product.categoryName }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="() => openModal(product)" class="text-blue-500 hover:text-blue-800">Modifier</button>
            <button @click="() => deleteProduct(product.id)" class="text-red-500 hover:text-red-800 ml-4">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal || showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <button class="close absolute top-0 right-0 cursor-pointer px-4 py-3 text-red-500 hover:text-red-700" @click="closeAllModals">&times;</button>
        <h2 class="text-lg font-bold mb-4">{{ showModal ? 'Modifier Produit' : 'Ajouter un nouveau produit' }}</h2>
        <form @submit.prevent="showModal ? updateProduct() : addProduct()" class="space-y-4">
          <div>
            <label for="name" class="block font-medium text-gray-700">{{ showModal ? 'Nom:' : 'Nouveau nom:' }}</label>
            <input id="name" type="text" v-model="formProduct.name" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="description" class="block font-medium text-gray-700">{{ showModal ? 'Description:' : 'Nouvelle description:' }}</label>
            <input id="description" type="text" v-model="formProduct.description" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="price" class="block font-medium text-gray-700">{{ showModal ? 'Prix:' : 'Nouveau prix:' }}</label>
            <input id="price" type="number" v-model="formProduct.price" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="brand" class="block font-medium text-gray-700">{{ showModal ? 'Marque:' : 'Nouvelle marque:' }}</label>
            <input id="brand" type="text" v-model="formProduct.brand" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="category" class="block font-medium text-gray-700">{{ showModal ? 'Catégorie:' : 'Nouvelle catégorie:' }}</label>
            <select id="category" v-model="formProduct.categoryId" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {{ showModal ? 'Enregistrer les modifications' : 'Ajouter le produit' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminProducts',
  data() {
    return {
      products: [],
      categories: [],
      showModal: false,
      showAddModal: false,
      formProduct: {
        id: '',
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        brand: ''
      }
    };
  },
  methods: {
    async fetchCategoriesAndProducts() {
      try {
        const categoryResponse = await axios.get('http://localhost:3000/categories', { withCredentials: true });
        this.categories = categoryResponse.data;
        await this.fetchProducts();
      } catch (error) {
        console.error("There was an error fetching the categories or products:", error);
      }
    },
    fetchProducts() {
      axios.get('http://localhost:3000/products', { withCredentials: true })
          .then(response => {
            this.products = response.data.map(product => ({
              ...product,
              categoryName: this.categories.find(c => c.id === product.categoryId)?.name || 'Aucune catégorie'
            }));
          })
          .catch(error => {
            console.error("There was an error fetching the products:", error);
          });
    },
    openModal(product) {
      this.formProduct = {...product, categoryId: product.categoryId, brand: product.brand};
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    updateProduct() {
      axios.patch(`http://localhost:3000/products/${this.formProduct.id}`, this.formProduct, { withCredentials: true })
          .then(() => {
            this.closeModal();
            this.fetchProducts();
          })
          .catch(error => {
            console.error("Failed to update product:", error);
          });
    },
    openAddModal() {
      this.formProduct = { name: '', description: '', price: 0, categoryId: this.categories[0]?.id, brand: '' };
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    addProduct() {
      axios.post('http://localhost:3000/products', this.formProduct, { withCredentials: true })
          .then(() => {
            this.closeAddModal();
            this.fetchProducts();
          })
          .catch(error => {
            console.error("Failed to add product:", error);
          });
    },
    deleteProduct(productId) {
      axios.delete(`http://localhost:3000/products/${productId}`, { withCredentials: true })
          .then(() => {
            this.fetchProducts();
          })
          .catch(error => {
            console.error("Failed to delete product:", error);
          });
    },
    closeAllModals() {
      this.showModal = false;
      this.showAddModal = false;
    }
  },
  mounted() {
    this.fetchCategoriesAndProducts();
  }
};
</script>
