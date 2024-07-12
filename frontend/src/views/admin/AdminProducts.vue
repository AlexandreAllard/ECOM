<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Gestion des Produits</h1>
    <button @click="openAddModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
      Ajouter un produit
    </button>
    <data-table
        :data="products"
        :columns="columns"
        @update-item="openModal"
        @delete-item="deleteProduct"
    />
    <div v-if="showModal" class="modal-backdrop">
      <product-form
          :product="selectedProduct"
          :categories="categories"
          :is-new="false"
          @save="saveProduct"
          @close="closeAllModals"
      />
    </div>
    <div v-if="showAddModal" class="modal-backdrop">
      <product-form
          :product="selectedProduct"
          :categories="categories"
          :is-new="true"
          @save="saveProduct"
          @close="closeAllModals"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DataTable from '../../components/DataTable.vue';
import ProductForm from '../../components/ProductForm.vue';

export default {
  components: {
    DataTable,
    ProductForm
  },
  data() {
    return {
      products: [],
      categories: [],
      showModal: false,
      showAddModal: false,
      selectedProduct: {name: '', description: '', price: 0, brand: '', categoryId: ''},
    };
  },
  computed: {
    columns() {
      return [
        {key: 'name', label: 'Nom'},
        {key: 'description', label: 'Description'},
        {key: 'price', label: 'Prix'},
        {key: 'brand', label: 'Marque'},
        {key: 'categoryId', label: 'Catégorie', format: (value) => this.formatCategoryName(value)}
      ];
    }
  },
  methods: {
    formatCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Catégorie inconnue';
    },
    fetchProductsAndCategories() {
      Promise.all([
        axios.get('http://localhost:3000/products', {withCredentials: true}),
        axios.get('http://localhost:3000/categories', {withCredentials: true})
      ]).then(([productsRes, categoriesRes]) => {
        this.products = productsRes.data;
        this.categories = categoriesRes.data;
      }).catch(error => console.error("Error fetching data:", error));
    },
    openModal(product) {
      console.log('Opening modal with product:', product);
      this.selectedProduct = { ...product };
      this.showModal = true;
      this.showAddModal = false;
      console.log('Modal should now be visible:', this.showModal);
    },
    openAddModal() {
      this.selectedProduct = {name: '', description: '', price: 0, brand: '', categoryId: this.categories[0]?.id};
      this.showAddModal = true;
      this.showModal = false;
    },
    closeAllModals() {
      this.showModal = false;
      this.showAddModal = false;
    },
    saveProduct(product) {
      console.log('Saving product:', product);
      const method = product.id ? 'patch' : 'post';
      const url = product.id ? `http://localhost:3000/products/${product.id}` : 'http://localhost:3000/products';
      axios[method](url, product, {withCredentials: true}).then(() => {
        this.fetchProductsAndCategories();
        this.closeAllModals();
      }).catch(error => console.error("Failed to save product:", error));
    },
    deleteProduct(productId) {
      axios.delete(`http://localhost:3000/products/${productId}`, {withCredentials: true}).then(() => {
        this.fetchProductsAndCategories();
      }).catch(error => console.error("Failed to delete product:", error));
    }
  },
  mounted() {
    this.fetchProductsAndCategories();
    console.log('Products and Categories fetched:', this.products, this.categories);
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
