<template>
  <div class="modal-container">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Nom de la catégorie
          </label>
          <input v-model="category.name" type="text" id="name" placeholder="Nom"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
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
    category: Object,
    isNew: Boolean
  },
  methods: {
    handleSubmit() {
      if (!this.category.name) {
        alert('Le nom de la catégorie est requis.');
        return;
      }
      this.$emit('save', this.category);
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
