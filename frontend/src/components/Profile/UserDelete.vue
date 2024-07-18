<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Supprimer mon compte</h2>
    <button
        @click="openModal = true"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
    >
      Supprimer
    </button>

    <div v-if="openModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center px-4 py-6">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold">Confirmer la suppression</h3>
        <p class="text-gray-700 my-4">Veuillez taper "DELETE" pour confirmer la suppression de votre compte.</p>
        <input
            type="text"
            v-model="confirmationInput"
            @input="checkInput"
            class="p-2 border border-gray-300 rounded w-full"
            placeholder="DELETE"
        >
        <div class="mt-4 flex justify-between gap-6">
          <button
              @click="openModal = false"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full transition duration-200 ease-in-out"
          >
            Annuler
          </button>
          <button
              @click="deleteUser"
              :disabled="!canDelete"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200 ease-in-out"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

export default {
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    const confirmationInput = ref('');
    const openModal = ref(false);
    const canDelete = computed(() => confirmationInput.value.toUpperCase() === 'DELETE');

    const deleteUser = () => {
      if (canDelete.value) {
        const id = auth.user.id;
        axios.delete(`http://localhost:3000/userss/${id}`, { withCredentials: true })
            .then(() => {
              alert('Votre compte a été supprimé avec succès.');
              auth.logout();
              router.push('/');
            })
            .catch(error => {
              console.error("Erreur lors de la suppression du compte:", error);
              alert("La suppression du compte a échoué.");
            })
            .finally(() => {
              openModal.value = false;
            });
      }
    };

    return {
      confirmationInput,
      openModal,
      canDelete,
      deleteUser
    };
  }
};
</script>
