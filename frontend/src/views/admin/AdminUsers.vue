<template>
  <div class="max-w-7xl mx-auto py-6">
    <p class="text-xl font-semibold mb-4">Administration des Utilisateurs</p>
    <button @click="openAddModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
      Ajouter un utilisateur
    </button>
    <data-table
        :data="users"
        :columns="columns"
        :actions="actions"
        @delete-item="deleteUser"
        @update-item="openModal"
    />
    <div v-if="showModal" class="modal-backdrop">
      <user-form
          :user="selectedUser"
          :is-new="false"
          @save="saveUser"
          @close="closeModal"
      />
    </div>
    <div v-if="showAddModal" class="modal-backdrop">
      <user-form
          :user="newUser"
          :is-new="true"
          @save="saveUser"
          @close="closeAddModal"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DataTable from "../../components/DataTable.vue";
import UserForm from "../../components/UserForm.vue";

export default {
  components: {
    DataTable,
    UserForm
  },
  data() {
    return {
      users: [],
      showModal: false,
      showAddModal: false,
      selectedUser: null,
      newUser: { email: '', firstname: '', lastname: '', password: '', role: 'user' }
    };
  },
  computed: {
    columns() {
      return [
        { key: 'email', label: 'Email', sortable: true, searchable: true },
        { key: 'lastname', label: 'Nom', sortable: true, searchable: true },
        { key: 'firstname', label: 'Prénom', sortable: true, searchable: true }
      ];
    },
    actions() {
      return ['edit', 'delete'];
    }
  },
  methods: {
    fetchUsers() {
      axios.get('http://localhost:3000/users', { withCredentials: true })
          .then(response => {
            this.users = response.data;
          })
          .catch(error => console.error("Error fetching the users:", error));
    },
    openModal(user) {
      this.selectedUser = { ...user };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedUser = null;
    },
    openAddModal() {
      this.newUser = { email: '', firstname: '', lastname: '', password: '', role: 'user' };
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    saveUser(user) {
      const method = user.id ? 'patch' : 'post';
      const url = user.id ? `http://localhost:3000/users/${user.id}` : 'http://localhost:3000/users';
      axios[method](url, user, { withCredentials: true })
          .then(() => {
            this.closeModal();
            this.closeAddModal();
            this.fetchUsers();
            alert('Changes saved successfully.');
          })
          .catch(error => console.error("Failed to save user:", error));
    },
    deleteUser(userId) {
      axios.delete(`http://localhost:3000/users/${userId}`, { withCredentials: true })
          .then(() => this.fetchUsers())
          .catch(error => console.error("Failed to delete user:", error));
    }
  },
  mounted() {
    this.fetchUsers();
  }
}
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
