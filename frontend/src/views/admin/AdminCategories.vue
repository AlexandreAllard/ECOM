<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Gestion des Catégories</h1>
    <button @click="openAddModal" class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Ajouter une catégorie
    </button>
    <data-table
        :data="categories"
        :columns="columns"
        @edit-item="openModal"
        @delete-item="deleteCategory"
    />
    <div v-if="showModal || showAddModal" class="modal-backdrop">
      <category-form
          :category="selectedCategory"
          :is-new="showAddModal"
          @save="saveCategory"
          @close="closeAllModals"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DataTable from '../../components/DataTable.vue';
import CategoryForm from '../../components/CategoryForm.vue';

export default {
  components: {
    DataTable,
    CategoryForm
  },
  data() {
    return {
      categories: [],
      showModal: false,
      showAddModal: false,
      selectedCategory: {name: ''},
      columns: [
        {key: 'name', label: 'Nom'}
      ]
    };
  },
  methods: {
    fetchCategories() {
      axios.get('http://localhost:3000/categories', {withCredentials: true})
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => console.error("Error fetching categories:", error));
    },
    openModal(category) {
      this.selectedCategory = {...category};
      this.showModal = true;
      this.showAddModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    openAddModal() {
      this.selectedCategory = {name: ''};
      this.showAddModal = true;
      this.showModal = false;
    },
    closeAllModals() {
      this.showModal = false;
      this.showAddModal = false;
    },
    saveCategory(category) {
      const method = category.id ? 'patch' : 'post';
      const url = category.id ? `http://localhost:3000/categories/${category.id}` : 'http://localhost:3000/categories';
      axios[method](url, category, {withCredentials: true})
          .then(() => {
            this.fetchCategories();
            this.closeAllModals();
          })
          .catch(error => console.error("Failed to save category:", error));
    },
    deleteCategory(categoryId) {
      axios.delete(`http://localhost:3000/categories/${categoryId}`, {withCredentials: true})
          .then(() => this.fetchCategories())
          .catch(error => console.error('Failed to delete category:', error));
    }
  },
  mounted() {
    this.fetchCategories();
  }
};
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
