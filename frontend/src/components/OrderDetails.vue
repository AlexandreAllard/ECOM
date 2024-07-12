<template>
  <div class="modal-container">
    <div class="modal-content">
      <h2 class="text-lg font-bold mb-4">Détails de la commande</h2>
      <p><strong>ID:</strong> {{ order.id }}</p>
      <p><strong>Utilisateur:</strong> {{ order.userId }}</p>
      <p><strong>Total:</strong> {{ order.total }} €</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.product.name }} - {{ item.quantity }} x {{ item.price }} €
        </li>
      </ul>
      <button @click="$emit('close')" class="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Fermer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: Object
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
