<template>
  <div class="modal-container">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Nom du produit
          </label>
          <input v-model="product.name" type="text" id="name" placeholder="Nom du produit"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <input v-model="product.description" type="text" id="description" placeholder="Description"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
            Prix
          </label>
          <input v-model="product.price" type="number" id="price" placeholder="Prix"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="brand">
            Marque
          </label>
          <input v-model="product.brand" type="text" id="brand" placeholder="Marque"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
            Catégorie
          </label>
          <select v-model="product.categoryId" id="category" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Enregistrer
          </button>
          <button @click="$emit('close')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
    categories: Array,
    isNew: Boolean
  },
  methods: {
    handleSubmit() {
      if (!this.product.name || !this.product.description || !this.product.price || !this.product.brand || !this.product.categoryId) {
        alert('Tous les champs doivent être remplis.');
        return;
      }
      this.$emit('save', this.product);
    }
  }
};
</script>

<style scoped>
.modal-container {
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

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
</style>
