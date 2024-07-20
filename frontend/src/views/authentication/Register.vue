<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center text-gray-700">Inscription</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Prénom</label>
          <input type="text" v-model="formData.firstname" placeholder="Votre prénom" required
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.firstname}">
          <p v-if="errors.firstname" class="mt-2 text-sm text-red-600">{{ errors.firstname }}</p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Nom</label>
          <input type="text" v-model="formData.lastname" placeholder="Votre nom" required
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.lastname}">
          <p v-if="errors.lastname" class="mt-2 text-sm text-red-600">{{ errors.lastname }}</p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="formData.email" placeholder="exemple@domaine.com" required
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.email}">
          <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
          <input type="password" v-model="formData.password" placeholder="••••••••" required
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.password}">
          <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
        </div>
        <div>
          <button type="submit" :disabled="isLoading"
                  class="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:bg-blue-700 focus:outline-none"
                  :class="{'opacity-50': isLoading}">
            S'inscrire
          </button>
        </div>
      </form>
      <div v-if="serverError" class="mt-4 text-center text-sm text-red-600">{{ serverError }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useForm } from '../../composables/useForm';
import { z } from 'zod';

const router = useRouter();

const schema = z.object({
  firstname: z.string().nonempty({ message: "Le prénom est requis" }),
  lastname: z.string().nonempty({ message: "Le nom est requis" }),
  email: z.string().email({ message: "Adresse email invalide" }).nonempty({ message: "L'email est requis" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
});

const { formData, errors, isLoading, handleSubmit: baseHandleSubmit } = useForm({
  firstname: '',
  lastname: '',
  email: '',
  password: ''
}, schema, '', 'post');

async function register() {
  try {
    await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/users`, formData);
    alert('Inscription réussie, veuillez vérifier votre email pour activer votre compte.');
    router.push('/login');
  } catch (error) {
    errors.customError = error.response?.data?.message || 'Erreur lors de l\'inscription';
  }
}

const handleSubmit = async () => {
  await baseHandleSubmit();
  if (Object.keys(errors).every(key => errors[key] === null)) {
    await register();
  }
}
</script>
