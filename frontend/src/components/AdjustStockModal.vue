<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold mb-4">Ajuster le Stock pour: {{ product.name }}</h2>
      <form @submit.prevent="submitAdjustment">
        <div class="mb-4">
          <label for="adjustment" class="block text-gray-700 text-sm font-bold mb-2">Ajustement:</label>
          <input type="number" id="adjustment" v-model.number="adjustment"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 placeholder="Entrez un nombre (positif ou négatif)">
        </div>
        <div class="mb-6">
          <label for="justification" class="block text-gray-700 text-sm font-bold mb-2">Justification:</label>
          <textarea id="justification" v-model="justification"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Expliquez la raison de cet ajustement"></textarea>
        </div>
        <div class="flex items-center justify-between">
          <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit">
            Confirmer
          </button>
          <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              @click="$emit('close')">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      adjustment: 0,
      justification: ''
    };
  },
  methods: {
    submitAdjustment() {
      const payload = {
        adjustment: this.adjustment,
        justification: this.justification
      };
      axios.post(`http://localhost:3000/products/${this.product.id}/stock-adjustments`, payload, { withCredentials: true })
          .then(() => {
            this.$emit('close');
            this.$emit('adjustment-success');
            this.$emit('stock-adjusted', { productId: this.product.id, adjustment: this.adjustment });
          })
          .catch(error => {
            console.error('Erreur lors de l\'ajustement du stock:', error);
            alert('Erreur lors de l\'ajustement du stock.');
          });
    }
  }
}
</script>
