<template>
  <div class="max-w-7xl mx-auto py-6">
    <p class="text-xl font-semibold mb-4">Admin</p>
    <button @click="openAddModal()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
      Ajouter un utilisateur
    </button>
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Email
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Nom
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Prénom
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ user.id }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ user.email }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ user.lastname }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ user.firstname }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="openModal(user)" class="text-blue-500 hover:text-blue-800">Modifier</button>
            <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-800 ml-4">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <span class="close text-red-500 hover:text-red-700 cursor-pointer" @click="closeModal()">&times;</span>
        <h2 class="text-lg font-bold mb-4">Modifier Utilisateur</h2>
        <form @submit.prevent="updateUser" class="space-y-4">
          <div>
            <label for="email" class="block font-medium text-gray-700">Email:</label>
            <input type="email" id="email" v-model="selectedUser.email" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="firstname" class="block font-medium text-gray-700">Prénom:</label>
            <input type="text" id="firstname" v-model="selectedUser.firstname" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="lastname" class="block font-medium text-gray-700">Nom:</label>
            <input type="text" id="lastname" v-model="selectedUser.lastname" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <span class="close text-red-500 hover:text-red-700 cursor-pointer" @click="closeAddModal">&times;</span>
        <h2 class="text-lg font-bold mb-4">Ajouter un nouvel utilisateur</h2>
        <form @submit.prevent="addUser" class="space-y-4">
          <div>
            <label for="newEmail" class="block font-medium text-gray-700">Email:</label>
            <input type="email" id="newEmail" v-model="newUser.email" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="newFirstname" class="block font-medium text-gray-700">Prénom:</label>
            <input type="text" id="newFirstname" v-model="newUser.firstname" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="newLastname" class="block font-medium text-gray-700">Nom:</label>
            <input type="text" id="newLastname" v-model="newUser.lastname" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <div>
            <label for="newPassword" class="block font-medium text-gray-700">Mot de passe:</label>
            <input type="password" id="newPassword" v-model="newUser.password" required
                   class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
          </div>
          <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Ajouter l'utilisateur
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      showModal: false,
      showAddModal: false,
      selectedUser: null,
      newUser: {
        email: '',
        firstname: '',
        lastname: ''
      }
    };
  },
  methods: {
    fetchUsers() {
      axios.get('http://localhost:3000/users', {withCredentials: true})
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error("There was an error fetching the users:", error);
          });
    },
    openModal(user) {
      this.selectedUser = {...user};
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    updateUser() {
      axios.patch(`http://localhost:3000/users/${this.selectedUser.id}`, this.selectedUser, {withCredentials: true})
          .then(() => {
            this.closeModal();
            this.fetchUsers();
          })
          .catch(error => {
            console.error("Failed to update user:", error);
          });
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    addUser() {
      axios.post('http://localhost:3000/users', this.newUser, {withCredentials: true})
          .then(() => {
            alert("Utilisateur ajouté avec succès");
            this.closeAddModal();
            this.fetchUsers();
          })
          .catch(error => {
            console.error("Failed to add user:", error);
            alert("Erreur lors de l'ajout de l'utilisateur : " + error.message);
          });
    },
    deleteUser(userId) {
      axios.delete(`http://localhost:3000/users/${userId}`, {withCredentials: true})
          .then(() => {
            this.fetchUsers();
          })
          .catch(error => {
            console.error("Failed to delete user:", error);
          });
    }
  },
  mounted() {
    this.fetchUsers();
  }
}
</script>
