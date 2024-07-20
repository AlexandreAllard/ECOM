<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-6">
    <div v-if="loading" class="text-lg text-center font-semibold text-blue-600">
      Activating your account...
    </div>
    <div v-else class="text-lg text-center font-semibold p-6 bg-white rounded-lg shadow">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      message: ''
    };
  },
  async created() {
    try {
      const token = this.$route.params.token;
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/users/verify/${token}`);
      this.message = 'Votre compte a été activé avec succès!';
    } catch (error) {
      this.message = 'Le lien est invalide ou a expiré.';
    } finally {
      this.loading = false;
    }
  }
}
</script>
