<template>
  <nav class="bg-black text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link class="text-xl font-semibold tracking-widest uppercase hover:text-gray-400" to="/">MECASCRAP</router-link>
        <router-link v-if="!isLoggedIn" class="hidden md:inline-block nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/auth/login">Connexion</router-link>
        <router-link v-if="!isLoggedIn" class="hidden md:inline-block nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/auth/register">Inscription</router-link>
        <router-link class="hidden md:inline-block nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/produits">Produits</router-link>
        <router-link class="hidden md:inline-block nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/categories">Categories</router-link>
        <router-link v-if="isLoggedIn" class="hidden md:inline-block nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/cart">Panier</router-link>
      </div>
      <div class="flex items-center space-x-4">
        <div v-if="role === 'admin' || role === 'storekeeper'" class="hidden md:inline-block">
          <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/management/orders">Management</router-link>
        </div>
        <router-link v-if="isLoggedIn" class="hidden md:inline-block nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/profile">Profile</router-link>
        <button v-if="isLoggedIn" class="logout-button py-2 px-4 bg-red-600 hover:bg-red-700 rounded" @click="logout">Déconnexion</button>
        <button @click="toggleMobileMenu" class="md:hidden focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
    <div v-if="mobileMenuOpen" class="md:hidden bg-black">
      <router-link class="block py-2 px-4 text-white hover:bg-gray-600" to="/">Home</router-link>
      <router-link v-if="!isLoggedIn" class="block py-2 px-4 text-white hover:bg-gray-600" to="/login">Connexion</router-link>
      <router-link v-if="!isLoggedIn" class="block py-2 px-4 text-white hover:bg-gray-600" to="/register">Inscription</router-link>
      <router-link v-if="isLoggedIn" class="block py-2 px-4 text-white hover:bg-gray-600" to="/produits">Produits</router-link>
      <router-link v-if="isLoggedIn" class="block py-2 px-4 text-white hover:bg-gray-600" to="/cart">Cart</router-link>
      <router-link v-if="isLoggedIn" class="block py-2 px-4 text-white hover:bg-gray-600" to="/profile">Profile</router-link>
      <router-link v-if="role === 'admin'" class="block py-2 px-4 text-white hover:bg-gray-600" to="/admin">Management</router-link>
      <button v-if="isLoggedIn" class="w-full text-left py-2 px-4 text-white hover:bg-gray-600" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => auth.isLoggedIn);
const role = computed(() => auth.role);

const logout = () => {
  auth.logout();
  router.push('/');
};

const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>
