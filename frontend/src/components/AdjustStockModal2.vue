<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Ajuster le stock de {{ product.name }}</h2>
      <div class="mb-4">
        <label for="adjustment" class="block text-sm font-medium text-gray-700">Ajustement</label>
        <input
            v-model.number="change"
            type="number"
            id="adjustment"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div class="mb-4">
        <label for="justification" class="block text-sm font-medium text-gray-700">Justification</label>
        <textarea
            v-model="justification"
            id="justification"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button @click="$emit('close')" class="text-gray-700 hover:text-gray-900 mr-4">Annuler</button>
        <button @click="saveAdjustment" class="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      change: 0,
      justification: '',
    };
  },
  methods: {
    saveAdjustment() {
      this.$emit('save', this.product, this.change, this.justification);
    },
  },
};
</script>

<style scoped>
/* Ajoutez ici vos styles personnalisés */
</style>
