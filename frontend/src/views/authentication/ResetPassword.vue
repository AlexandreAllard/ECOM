<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Réinitialisation du mot de passe</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <input
              v-model="formData.password"
              type="password"
              placeholder="Nouveau mot de passe"
              @input="clearError('password')"
              @blur="touched.password = true; validate()"
              class="w-full p-3 border border-gray-300 rounded focus:border-black focus:outline-none focus:ring"
              :class="{'border-red-500': errors.password && touched.password}"
              required
          >
          <p v-if="errors.password && touched.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
        </div>
        <div>
          <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirmation"
              @input="clearError('confirmPassword')"
              @blur="touched.confirmPassword = true; validate()"
              class="w-full p-3 border border-gray-300 rounded focus:border-black focus:outline-none focus:ring"
              :class="{'border-red-500': errors.confirmPassword && touched.confirmPassword}"
              required
          >
          <p v-if="errors.confirmPassword && touched.confirmPassword" class="mt-2 text-sm text-red-600">{{ errors.confirmPassword }}</p>
        </div>
        <button
            type="submit"
            class="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 focus:bg-gray-900 focus:outline-none"
            :class="{'opacity-50': isLoading}"
            :disabled="isLoading"
        >
          Réinitialiser le mot de passe
        </button>
      </form>
      <p v-if="serverError" class="text-center text-red-500 mt-4">{{ serverError }}</p>
      <p v-if="isSuccess" class="text-center text-green-500 mt-4">Votre mot de passe a été réinitialisé avec succès.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from '../../composables/useForm';
import { z } from 'zod';
import axios from 'axios';

const route = useRoute();
const token = ref(route.params.token);

const schema = z.object({
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const { formData, errors, isLoading, serverError, isSuccess, handleSubmit: baseHandleSubmit, touched, validate, clearError } = useForm({
  password: '',
  confirmPassword: ''
}, schema, '', 'post');

const resetPassword = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/auths/reset/${token.value}`, {newPassword: formData.password});
    isSuccess.value = true;
  } catch (error) {
    serverError.value = error.response?.data?.message || "Le lien de réinitialisation est invalide ou a expiré.";
  }
};

const handleSubmit = async () => {
  touched.value.password = true;
  touched.value.confirmPassword = true;
  await baseHandleSubmit();
  if (Object.keys(errors).every(key => errors[key] === null)) {
    await resetPassword();
  }
}

</script>
