<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
      <h2 class="mt-6 text-3xl font-extrabold text-center">
        Se connecter
      </h2>
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" v-model="formData.email" @input="clearError('email')"
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                 :class="{'border-red-500': errors.email && touched.email}">
          <p v-if="errors.email && touched.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input id="password" type="password" v-model="formData.password" @input="clearError('password')"
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                 :class="{'border-red-500': errors.password && touched.password}">
          <p v-if="errors.password && touched.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <button type="submit" :disabled="isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                :class="{'opacity-50': isLoading}">
          Je me connecte
        </button>
        <div v-if="serverError" class="mt-4 text-center text-sm text-red-600">{{ serverError }}</div>
      </form>
      <div class="flex items-center justify-between mt-4">
        <router-link to="/auth/reset-password-request" class="font-medium text-black hover:text-gray-700">
          Mot de passe oublié?
        </router-link>
        <router-link to="/auth/resend-verification" class="font-medium text-black hover:text-gray-700">
          Vérifier mon compte
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useForm } from '../../composables/useForm';
import { z } from 'zod';
import { ref } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

const schema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }).nonempty({ message: "Email obligatoire" }),
  password: z.string()
      .min(6, { message: "Le mot de passe doit contenir au moins 12 caractères" })
});

const {formData, errors, isLoading, handleSubmit: baseHandleSubmit} = useForm({
  email: '',
  password: ''
}, schema, '', 'post');

const touched = ref({
  email: false,
  password: false,
});

async function login() {
  const errorMessage = await authStore.login(formData);
  if (!errorMessage) {
    router.push('/');
  } else {
    errors.customError = errorMessage;
  }
}

const handleSubmit = async () => {
  touched.value.email = true;
  touched.value.password = true;
  await baseHandleSubmit();
  if (Object.keys(errors).every(key => errors[key] === null)) {
    await login();
  }
}

const clearError = (field) => {
  touched.value[field] = true;
}
</script>
