<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center text-gray-700">Inscription</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Prénom</label>
          <input type="text" v-model="formData.firstname" placeholder="Votre prénom" required
                 @input="clearError('firstname')"
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-black focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.firstname && touched.firstname}">
          <p v-if="errors.firstname && touched.firstname" class="mt-2 text-sm text-red-600">{{ errors.firstname }}</p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Nom</label>
          <input type="text" v-model="formData.lastname" placeholder="Votre nom" required
                 @input="clearError('lastname')"
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-black focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.lastname && touched.lastname}">
          <p v-if="errors.lastname && touched.lastname" class="mt-2 text-sm text-red-600">{{ errors.lastname }}</p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="formData.email" placeholder="exemple@domaine.com" required
                 @input="clearError('email')"
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-black focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.email && touched.email}">
          <p v-if="errors.email && touched.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
          <input type="password" v-model="formData.password" placeholder="••••••••" required
                 @input="clearError('password')"
                 class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-black focus:outline-none focus:ring"
                 :class="{'border-red-500': errors.password && touched.password}">
          <p v-if="errors.password && touched.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="acceptTerms" id="acceptTerms" class="mr-2">
          <label for="acceptTerms" class="text-sm text-gray-700">
            J'accepte les <router-link to="/cgv" class="text-black hover:underline">CGV/CGU</router-link> et les <router-link to="/mentions-legales" class="text-black hover:underline">Mentions légales</router-link>
          </label>
        </div>
        <div>
          <button type="submit" :disabled="isLoading || !acceptTerms"
                  class="block w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:bg-gray-900 focus:outline-none"
                  :class="{'opacity-50': isLoading || !acceptTerms}">
            S'inscrire
          </button>
        </div>
      </form>
      <div v-if="serverError" class="mt-4 text-center text-sm text-red-600">{{ serverError }}</div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import axios from 'axios';
import {useForm} from '../../composables/useForm';
import {z} from 'zod';
import {ref} from 'vue';

const router = useRouter();

const schema = z.object({
  firstname: z.string().nonempty({message: "Le prénom est requis"}),
  lastname: z.string().nonempty({message: "Le nom est requis"}),
  email: z.string().email({message: "Adresse email invalide"}).nonempty({message: "L'email est requis"}),
  password: z.string()
      .min(12, {message: "Le mot de passe doit contenir au moins 12 caractères"})
      .regex(/[a-z]/, {message: "Le mot de passe doit contenir au moins une lettre minuscule"})
      .regex(/[A-Z]/, {message: "Le mot de passe doit contenir au moins une lettre majuscule"})
      .regex(/[0-9]/, {message: "Le mot de passe doit contenir au moins un chiffre"})
      .regex(/[^a-zA-Z0-9]/, {message: "Le mot de passe doit contenir au moins un symbole"})
});

const {formData, errors, isLoading, serverError, handleSubmit: baseHandleSubmit} = useForm({
  firstname: '',
  lastname: '',
  email: '',
  password: ''
}, schema, '', 'post');

const touched = ref({
  firstname: false,
  lastname: false,
  email: false,
  password: false,
});

const acceptTerms = ref(false);

const clearError = (field) => {
  touched.value[field] = true;
}

async function register() {
  try {
    await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/userss`, formData);
    alert('Inscription réussie, veuillez vérifier votre email pour activer votre compte.');
    router.push('/login');
  } catch (error) {
    serverError.value = error.response?.data?.message || 'Erreur lors de l\'inscription';
  }
}

const handleSubmit = async () => {
  touched.value.firstname = true;
  touched.value.lastname = true;
  touched.value.email = true;
  touched.value.password = true;
  await baseHandleSubmit();
  if (Object.keys(errors).every(key => errors[key] === null)) {
    await register();
  }
}
</script>
