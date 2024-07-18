<template>
  <UserInformations />
  <UserOrders />
  <UserDeliveries />
  <UserSubscriptions />
  <UserDelete />
</template>
<script setup lang="ts">
import UserInformations from "../components/Profile/UserInformations.vue";
import UserOrders from "../components/Profile/UserOrders.vue";
import UserDeliveries from "../components/Profile/UserDeliveries.vue";
import UserSubscriptions from "../components/Profile/UserSubscriptions.vue";
import UserDelete from "../components/Profile/UserDelete.vue";
</script>
