<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
    <button v-if="isLoggedIn" @click="logout">Logout</button>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import {computed} from "vue";
const auth = useAuthStore();

const isLoggedIn = computed(() => auth.isLoggedIn);

const logout = () => {
  auth.logout();
  router.push('/');
};
</script>
