<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Gestion des Catégories</h1>
    <button @click="openAddModal" class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Ajouter une catégorie
    </button>
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ category.id }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ category.name }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="() => openModal(category)" class="text-blue-500 hover:text-blue-800">Modifier</button>
            <button @click="() => deleteCategory(category.id)" class="text-red-500 hover:text-red-800 ml-4">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <button class="close absolute top-0 right-0 cursor-pointer px-4 py-3 text-red-500 hover:text-red-700" @click="closeModal">&times;</button>
        <h2 class="text-lg font-bold mb-4">Modifier Catégorie</h2>
        <form @submit.prevent="updateCategory" class="space-y-4">
          <div>
            <label for="name" class="block font-medium text-gray-700">Nom:</label>
            <input id="name" type="text" v-model="selectedCategory.name" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Enregistrer les modifications</button>
        </form>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <button class="close absolute top-0 right-0 cursor-pointer px-4 py-3 text-red-500 hover:text-red-700" @click="closeAddModal">&times;</button>
        <h2 class="text-lg font-bold mb-4">Ajouter une nouvelle catégorie</h2>
        <form @submit.prevent="addCategory" class="space-y-4">
          <div>
            <label for="newName" class="block font-medium text-gray-700">Nom:</label>
            <input id="newName" type="text" v-model="newCategory.name" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Ajouter la catégorie</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminCategories',
  data() {
    return {
      categories: [],
      showModal: false,
      showAddModal: false,
      selectedCategory: null,
      newCategory: {
        name: '',
        description: ''
      }
    };
  },
  methods: {
    fetchCategories() {
      axios.get('http://localhost:3000/categories', {withCredentials: true})
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => {
            console.error("There was an error fetching the categories:", error);
          });
    },
    openModal(category) {
      this.selectedCategory = { ...category };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    updateCategory() {
      axios.patch(`http://localhost:3000/categories/${this.selectedCategory.id}`, this.selectedCategory, {withCredentials: true})
          .then(() => {
            this.closeModal();
            this.fetchCategories();
          })
          .catch(error => {
            console.error("Failed to update category:", error);
          });
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    addCategory() {
      axios.post('http://localhost:3000/categories', this.newCategory, {withCredentials: true})
          .then(() => {
            this.closeAddModal();
            this.fetchCategories();
          })
          .catch(error => {
            console.error("Failed to add category:", error);
          });
    },
    deleteCategory(categoryId) {
      axios.delete(`http://localhost:3000/categories/${categoryId}`, {withCredentials: true})
          .then(() => {
            this.fetchCategories();
          })
          .catch(error => {
            console.error("Failed to delete category:", error);
          });
    }
  },
  mounted() {
    this.fetchCategories();
  }
}
</script>
