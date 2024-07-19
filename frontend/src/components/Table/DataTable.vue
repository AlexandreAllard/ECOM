<template>
  <div class="max-w-6xl mx-auto px-6 py-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <div>

        <input type="text" v-model="searchQuery" placeholder="Recherche..."
               class="border p-2 rounded-l-none rounded-r mr-2">
        <button @click="openCreateModal" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Ajouter
        </button>
        <button @click="exportSelectedToCSV"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  ml-2 rounded">
          Exporter
        </button>
      </div>
    </div>
    <div class="bg-white shadow rounded-lg">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <input type="checkbox" @change="toggleAll" v-model="allSelected" class="ml-3">
          </th>
          <th v-for="column in columns" :key="column.field" @click="sortData(column.field)"
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
            {{ column.name }} <span v-if="sortField === column.field">{{
              sortOrder[column.field] === 'asc' ? '↑' : '↓'
            }}</span>
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-100">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <input type="checkbox" v-model="selected" :value="item.id" class="ml-3">
          </td>
          <td v-for="column in columns" :key="column.field" class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ item[column.field] }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="openEditModal(item)" class="text-blue-500 hover:text-blue-800">Éditer</button>
            <button @click="handleAction('delete', item)" class="text-red-500 hover:text-red-800">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
      <pagination :total-pages="totalPages" :current-page="currentPage" @change-page="changePage"/>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ currentEditData.id ? 'Éditer Utilisateur' : 'Ajouter Utilisateur' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm">
          <div v-for="key in (currentEditData.id ? editableFields : createFields)" :key="key">
            <label :for="key" class="block text-sm font-medium text-gray-700">{{ formatLabel(key) }}</label>
            <input type="text" :id="key" v-model="currentEditData[key]"
                   class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          </div>
          <button type="submit"
                  class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Soumettre
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from './Pagination.vue';
import axios from 'axios';

export default {
  components: {Pagination},
  props: {
    data: Array,
    columns: Array,
    title: String,
    editableFields: Array,
    createFields: Array,
    submitUrl: String,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      searchQuery: '',
      sortField: null,
      sortOrder: {},
      selected: [],
      allSelected: false,
      currentEditData: {},
      modalOpen: false,
    };
  },
  computed: {
    filteredData() {
      let result = [...this.data].filter(item =>
          this.columns.some(column =>
              item[column.field]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
          )
      );

      if (this.sortField) {
        result.sort((a, b) => {
          const mod = this.sortOrder[this.sortField] === 'asc' ? 1 : -1;
          const valueA = a[this.sortField];
          const valueB = b[this.sortField];

          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueA.localeCompare(valueB) * mod;
          } else if (typeof valueA === 'number' && typeof valueB === 'number') {
            return (valueA - valueB) * mod;
          } else {
            return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * mod;
          }
        });
      }

      return result;
    },    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredData.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
  },
  methods: {
    sortData(field) {
      if (this.sortField === field) {
        this.sortOrder[field] = this.sortOrder[field] === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = {[field]: 'asc'};
      }
    },

    sortFilteredData() {
      return [...this.filteredData].sort((a, b) => {
        const mod = this.sortOrder[this.sortField] === 'asc' ? 1 : -1;
        const valueA = a[this.sortField];
        const valueB = b[this.sortField];

        if (valueA == null || valueB == null) {
          return valueA ? -1 * mod : 1 * mod;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB) * mod;
        }

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * mod;
      });
    },
    changePage(newPage) {
      this.currentPage = newPage;
    },
    toggleAll() {
      const allCurrentlySelected = this.filteredData.every(item => this.selected.includes(item.id));

      if (allCurrentlySelected) {
        this.selected = [];
        this.allSelected = false;
      } else {
        this.selected = this.filteredData.map(item => item.id);
        this.allSelected = true;
      }
    },

    handleAction(action, item) {
      let method;
      let url = `${this.submitUrl.replace(/\/+$/, '')}/${item.id}`;

      switch (action) {
        case 'delete':
          method = 'delete';
          axios.delete(url, {withCredentials: true})
              .then(() => {
                alert('Item deleted successfully');
                this.$emit('update');
              })
              .catch(error => {
                console.error('Error during delete:', error);
                alert('Error during delete: ' + error.message);
              });
          break;
        case 'edit':
          this.openEditModal(item);
          break;
        case 'view':
          break;
        default:
          console.error('Unsupported action');
          return;
      }
    },
    openEditModal(item) {
      this.currentEditData = {...item};
      this.modalOpen = true;
    },
    openCreateModal() {
      this.currentEditData = this.createFields.reduce((acc, field) => {
        acc[field] = '';
        return acc;
      }, {});
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    },
    submitForm() {
      const method = this.currentEditData.id ? 'patch' : 'post';
      const url = this.currentEditData.id ? `${this.submitUrl}/${this.currentEditData.id}` : this.submitUrl;

      axios({
        method: method,
        url: url,
        data: this.currentEditData,
        withCredentials: true
      }).then(response => {
        this.closeModal();
        alert('Operation successful: ' + JSON.stringify(response.data));
        this.$emit('update');
      }).catch(error => {
        console.error('Error submitting data:', error);
        alert('Error: ' + error.message);
      });
    },
    formatLabel(key) {
      return key.charAt(0).toUpperCase() + key.slice(1);
    },
    exportSelectedToCSV() {
      const rows = this.selected.map(id => this.data.find(item => item.id === id));
      const csvContent = [
        this.columns.map(col => `"${col.name}"`).join(','),
        ...rows.map(row => this.columns.map(col => `"${String(row[col.field]).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  borderRadius: 8px;
  boxShadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close {
  cursor: pointer;
}
</style>
