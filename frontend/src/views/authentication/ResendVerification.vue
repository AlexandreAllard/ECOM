<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
      <h2 class="mt-6 text-3xl font-extrabold text-center">Renvoyer l'email de vérification</h2>
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              id="email"
              type="email"
              v-model="formData.email"
              @input="clearError('email')"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              :class="{'border-red-500': errors.email && touched.email}"
              placeholder="Entrez votre email"
              required
          />
          <p v-if="errors.email && touched.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 focus:bg-gray-900 transition duration-200"
            :class="{'opacity-50': isLoading}"
        >
          Renvoyer Email
        </button>
      </form>
      <div v-if="serverError" class="mt-4 text-center text-sm text-red-600">{{ serverError }}</div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {ref} from 'vue';
import {useForm} from '../../composables/useForm';
import {z} from 'zod';

const schema = z.object({
  email: z.string().email({message: "Adresse email invalide"}).nonempty({message: "L'email est requis"})
});

const {formData, errors, isLoading, serverError, handleSubmit: baseHandleSubmit} = useForm({
  email: ''
}, schema, '', 'post');

const touched = ref({
  email: false,
});

const clearError = (field) => {
  touched.value[field] = true;
  errors[field] = null;
};

async function resendVerificationEmail() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/auths/activate/send`, {email: formData.email});
    alert(response.data.message);
  } catch (error) {
    serverError.value = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de vérification';
  }
}

const handleSubmit = async () => {
  touched.value.email = true;
  await baseHandleSubmit();
  if (Object.keys(errors).every(key => errors[key] === null)) {
    await resendVerificationEmail();
  }
}
</script>
