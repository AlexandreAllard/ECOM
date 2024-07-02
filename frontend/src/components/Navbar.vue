<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex flex-wrap items-center justify-between">
      <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/">Home</router-link>
      <router-link v-if="!isLoggedIn" class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/login">Login</router-link>
      <div v-if="role === 'admin'">
        <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/admin">Admin</router-link>
        <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/admin/users">Users</router-link>
        <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/admin/categories">Categories</router-link>
        <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/admin/products">Products</router-link>
        <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/stock-management">Stock</router-link>
        <router-link class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/stock-history">Historique</router-link>
      </div>
      <router-link v-if="isLoggedIn" class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/profile">Profile</router-link>
      <router-link v-if="isLoggedIn" class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/produits">Produits</router-link>
      <router-link v-if="isLoggedIn" class="nav-link py-2 px-4 hover:bg-gray-700 rounded" to="/cart">Cart</router-link>
      <button v-if="isLoggedIn" class="logout-button py-2 px-4 bg-red-600 hover:bg-red-700 rounded" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { computed } from "vue";
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => auth.isLoggedIn);
const role = computed(() => auth.role);

const logout = () => {
  auth.logout();
  router.push('/');
};
</script>
