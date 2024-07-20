<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4 text-left">Profil</h1>
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <div class="space-y-4" v-if="user.id">
        <div>
          <p class="text-gray-700 font-semibold">ID :</p>
          <p class="text-gray-900">{{ user.id }}</p>
        </div>
        <div>
          <p class="text-gray-700 font-semibold">Nom :</p>
          <p class="text-gray-900">{{ user.firstname }} {{ user.lastname }}</p>
        </div>
        <div>
          <p class="text-gray-700 font-semibold">Email :</p>
          <p class="text-gray-900">{{ user.email }}</p>
        </div>
        <div>
          <p class="text-gray-700 font-semibold">Rôle :</p>
          <p class="text-gray-900">{{ user.role }}</p>
        </div>
      </div>
      <div class="mt-6 text-left" v-if="user.id">
        <button @click="openModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
          Modifier le profil
        </button>
      </div>
      <div v-else>
        <p class="text-gray-700">Chargement des données...</p>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h3 class="text-lg leading-6 font-medium text-gray-900 text-center mb-4">Modifier le profil</h3>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div v-for="field in profileFields" :key="field">
            <label :for="field" class="block text-sm font-medium text-gray-700">{{ formatLabel(field) }} :</label>
            <input :id="field" :type="field === 'email' ? 'email' : 'text'" v-model="formData[field]" required
                   class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <p v-if="errors[field]" class="text-red-500 text-xs mt-1">{{ errors[field] }}</p>
          </div>
          <div class="mt-6 text-center flex justify-between">
            <button type="button" @click="closeModal"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded">
              Annuler
            </button>
            <button type="submit" :disabled="isLoading"
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                    :class="{'opacity-50': isLoading}">
              Enregistrer les modifications
            </button>
          </div>
          <p v-if="serverError" class="text-red-500 text-center mt-4">{{ serverError }}</p>
        </form>
        <p v-if="confirmationMessage" class="text-green-500 text-center mt-4">{{ confirmationMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useForm } from '../../composables/useForm';
import { z } from 'zod';

const userId = localStorage.getItem('id');
const apiUrl = `${import.meta.env.VITE_API_ENDPOINT}:3000/userss/${userId}`;

const user = ref({
  id: null,
  firstname: '',
  lastname: '',
  email: '',
  role: ''
});

const showModal = ref(false);
const profileFields = ['firstname', 'lastname', 'email'];
const confirmationMessage = ref('');

const openModal = () => showModal.value = true;
const closeModal = () => showModal.value = false;
const formatLabel = (field) => field.charAt(0).toUpperCase() + field.slice(1);

const fetchUser = async () => {
  try {
    const response = await axios.get(apiUrl, {withCredentials: true});
    Object.assign(user.value, response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
  }
};

const schema = z.object({
  firstname: z.string().nonempty({message: "Prénom requis"}),
  lastname: z.string().nonempty({message: "Nom requis"}),
  email: z.string().email({message: "Email invalide"}).nonempty({message: "Email requis"})
});

const {formData, errors, isLoading, serverError, handleSubmit} = useForm(
    {firstname: '', lastname: '', email: ''},
    schema,
    apiUrl,
    'patch'
);

const updateProfile = async () => {
  try {
    const data = await handleSubmit();
    if (data) {
      Object.assign(user.value, formData);
      confirmationMessage.value = 'Profil mis à jour avec succès.';
      setTimeout(() => confirmationMessage.value = '', 3000);
      closeModal();
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    serverError.value = 'Erreur lors de la mise à jour du profil';
  }
};

onMounted(async () => {
  await fetchUser();
  Object.assign(formData, user.value);
});
</script>
