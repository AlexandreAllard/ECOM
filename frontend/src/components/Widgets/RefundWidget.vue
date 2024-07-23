<template>
  <div class="widget">
    <div class="header">Remboursement</div>
    <div class="content">
      <p>{{ refundCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const refundCount = ref(0);

const fetchRefundCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss`, { withCredentials: true });
    const orders = response.data;
    refundCount.value = orders.filter(order => order.status === 'asked_refund').length;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
  }
};

onMounted(fetchRefundCount);
</script>

<style scoped>
.widget {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  padding : 0 !important;
}

.header {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
  padding : 0 !important;


}

.content {
  font-size: 8px;
  text-align: center;
  width: 100%;
  padding : 0 !important;

}

p {
  font-size: 16px;
  font-weight: bold;
  padding : 0 !important;
  color: #f00;
}
</style>
