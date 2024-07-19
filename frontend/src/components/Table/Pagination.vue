<template>
  <div class="flex items-center justify-center space-x-2 my-2">
    <button @click="changePage(1)" :disabled="currentPage === 1"
            class="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-600 font-medium py-2 px-3 rounded-l"
            aria-label="Go to first page">
      &#171;
    </button>
    <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"
            class="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-600 font-medium py-2 px-3"
            aria-label="Previous page">
      &#8249;
    </button>
    <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
            :class="page === currentPage ? 'bg-blue-500 text-white font-medium shadow' : 'bg-white text-gray-600 hover:bg-gray-100'"
            class="py-2 px-3 border border-gray-300 rounded transition duration-150">
      {{ page }}
    </button>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages"
            class="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-600 font-medium py-2 px-3"
            aria-label="Next page">
      &#8250;
    </button>
    <button @click="changePage(totalPages)" :disabled="currentPage === totalPages"
            class="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-600 font-medium py-2 px-3 rounded-r"
            aria-label="Go to last page">
      &#187;
    </button>
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
