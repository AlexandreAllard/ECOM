<template>
  <AdminSidebar/>
  <router-view></router-view>
</template>

<script>
import AdminSidebar from "../../components/AdminSidebar.vue";

export default {
  name: 'Stock',
  components: {AdminSidebar},
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style scoped>
</style>
