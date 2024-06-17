<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
    <router-link v-if="role === 'admin'" to="/admin">Admin</router-link>
    <button v-if="isLoggedIn" @click="logout">Logout</button>
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
