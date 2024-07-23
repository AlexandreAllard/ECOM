<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Réinitialisation de mot de passe</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
              v-model="formData.email"
              type="email"
              placeholder="Entrez votre email"
              @input="clearError('email')"
              @blur="touched.email = true; validate()"
              class="w-full p-3 border border-gray-300 rounded focus:border-black focus:outline-none focus:ring"
              :class="{'border-red-500': errors.email && touched.email}"
              required
          >
          <p v-if="errors.email && touched.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <button
            type="submit"
            class="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 focus:bg-gray-900 focus:outline-none"
            :class="{'opacity-50': isLoading}"
            :disabled="isLoading"
        >
          Envoyer
        </button>
      </form>
      <p v-if="serverError" class="text-center text-red-500 mt-4">{{ serverError }}</p>
      <p v-if="isSuccess" class="text-center text-green-500 mt-4">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from '../../composables/useForm';
import { z } from 'zod';
import axios from 'axios';

const schema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }).nonempty({ message: "L'email est requis" })
});

const {
  formData,
  errors,
  isLoading,
  serverError,
  isSuccess,
  handleSubmit: baseHandleSubmit,
  touched,
  validate
} = useForm({
  email: ''
}, schema, '', 'post');

const successMessage = ref('');

const requestReset = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/auths/reset/send`, {email: formData.email});
    successMessage.value = response.data.message;
    isSuccess.value = true;
  } catch (error) {
    serverError.value = error.response ? error.response.data.message : 'Une erreur s’est produite';
  }
};

const handleSubmit = async () => {
  touched.value.email = true;
  await baseHandleSubmit();
  if (Object.keys(errors).every(key => errors[key] === null)) {
    await requestReset();
  }
}

const clearError = (field) => {
  touched.value[field] = true;
}
</script>
