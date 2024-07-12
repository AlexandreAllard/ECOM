<template>
  <div>
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th v-for="column in columns" :key="column.key"
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <div class="flex flex-col">
              <div @click="sortColumn(column.key)" class="cursor-pointer">
                {{ column.label }}
                <span v-if="sort.key === column.key" class="inline-block ml-2">
                    <i :class="sort.order === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                  </span>
              </div>
              <input v-if="column.searchable"
                     v-model="search[column.key]"
                     @input="applySearch"
                     type="text"
                     placeholder="Rechercher..."
                     class="mt-2 px-2 py-1 text-sm text-gray-700 border-gray-300 rounded">
            </div>
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedData" :key="item.id">
          <td v-for="column in columns" :key="column.key + item.id" class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ item[column.key] }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center space-x-3">
            <button @click="$emit('update-item', item)" class="text-blue-500 hover:text-blue-800">Modifier</button>
            <button @click="$emit('delete-item', item.id)" class="text-red-500 hover:text-red-800">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <pagination :total-pages="totalPages" :current-page="currentPage" @change-page="changePage"/>
  </div>
</template>

<script>
import Pagination from './Pagination.vue';

export default {
  components: {
    Pagination
  },
  props: {
    data: Array,
    columns: Array,
    actions: Array
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      sort: {
        key: '',
        order: 'asc'
      },
      search: {}
    };
  },
  computed: {
    filteredData() {
      return this.data.filter(item => {
        return Object.keys(this.search).every(key =>
            this.search[key] === '' || (item[key] && item[key].toString().toLowerCase().includes(this.search[key].toLowerCase()))
        );
      });
    },
    sortedData() {
      if (!this.sort.key) return this.filteredData;
      return [...this.filteredData].sort((a, b) => {
        let modifier = this.sort.order === 'asc' ? 1 : -1;
        return a[this.sort.key] === b[this.sort.key] ? 0 : (a[this.sort.key] < b[this.sort.key] ? -1 * modifier : 1 * modifier);
      });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.sortedData.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    }
  },
  methods: {
    sortColumn(key) {
      if (this.sort.key === key) {
        this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc';
      } else {
        this.sort.key = key;
        this.sort.order = 'asc';
      }
    },
    applySearch() {
      this.currentPage = 1;
    },
    changePage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style scoped>
.table-input {
  transition: all 0.2s;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 4px;
  outline: none;
}

.table-input:focus {
  border-color: #3182ce;
}
</style>
