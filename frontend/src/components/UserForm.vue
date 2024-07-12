<template>
  <div class="modal-container">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="user.email" type="email" id="email" placeholder="Email"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="firstname">
            Prénom
          </label>
          <input v-model="user.firstname" type="text" id="firstname" placeholder="Prénom"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="lastname">
            Nom
          </label>
          <input v-model="user.lastname" type="text" id="lastname" placeholder="Nom"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div v-if="isNew" class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mot de passe
          </label>
          <input v-model="user.password" type="password" id="password" placeholder="Mot de passe"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
            Rôle
          </label>
          <select v-model="user.role" id="role" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
            <option value="accountant">Comptable</option>
            <option value="storekeeper">Magasinier</option>
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
    user: Object,
    isNew: Boolean
  },
  methods: {
    handleSubmit() {
      this.$emit('save', this.user);
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
