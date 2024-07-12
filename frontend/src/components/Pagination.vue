<template>
  <div class="flex items-center justify-between">
    <button @click="changePage(1)" :disabled="currentPage === 1"
            class="bg-gray-300 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-l"
            aria-label="Go to first page">
      <<</button>
    <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"
            class="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4"
            aria-label="Previous page">
      <</button>
    <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
            :class="{
              'bg-blue-700 text-white font-bold shadow-lg': page === currentPage,
              'bg-white text-blue-700 hover:bg-blue-100': page !== currentPage
            }"
            class="py-2 px-4 border border-blue-500 hover:border-transparent rounded transition ease-in-out duration-150">
      {{ page }}
    </button>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages"
            class="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4"
            aria-label="Next page">
      ></button>
    <button @click="changePage(totalPages)" :disabled="currentPage === totalPages"
            class="bg-gray-300 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-r"
            aria-label="Go to last page">
      >></button>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    visiblePages() {
      const pages = [];
      const current = this.currentPage;
      const total = this.totalPages;
      const range = 2;

      for (let i = Math.max(2, current - range); i <= Math.min(total - 1, current + range); i++) {
        pages.push(i);
      }

      if (current - range > 2) {
        pages.unshift('...');
      }
      if (current + range < total - 1) {
        pages.push('...');
      }

      pages.unshift(1);
      if (total > 1) pages.push(total);

      return pages;
    }
  },
  methods: {
    changePage(page) {
      if (page === '...') return;
      if (page < 1 || page > this.totalPages) return;
      this.$emit('change-page', page);
    }
  }
};
</script>
