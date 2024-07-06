<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold text-center text-gray-700">Inscription</h1>
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Prénom</label>
          <input type="text" v-model="firstname" placeholder="Votre prénom" required class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring">
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Nom</label>
          <input type="text" v-model="lastname" placeholder="Votre nom" required class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring">
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="email" placeholder="exemple@domaine.com" required class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring">
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
          <input type="password" v-model="password" placeholder="••••••••" required class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring">
        </div>
        <div>
          <button type="submit" class="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:bg-blue-700 focus:outline-none">S'inscrire</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      firstname: '',
      lastname: ''
    };
  },
  methods: {
    register() {
      const userData = {
        email: this.email,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname
      };
      axios.post('http://localhost:3000/users', userData)
          .then(response => {
            alert('Inscription réussie, veuillez vérifier votre email pour activer votre compte.');
            this.$router.push('/login');
          })
          .catch(error => {
            alert('Erreur lors de l\'inscription: ' + error.response.data.message);
          });
    }
  }
};
</script>
