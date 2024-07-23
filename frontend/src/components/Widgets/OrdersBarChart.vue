<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
  name: 'OrdersBarChart',
  setup() {
    const canvas = ref(null);
    const ordersData = ref([]);

    const fetchOrdersData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss`, { withCredentials: true });
        ordersData.value = processOrdersData(response.data);
        createChart();
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      }
    };

    const processOrdersData = (orders) => {
      const orderCounts = {};

      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!orderCounts[date]) {
          orderCounts[date] = 0;
        }
        orderCounts[date]++;
      });

      const sortedDates = Object.keys(orderCounts).sort((a, b) => new Date(a) - new Date(b));
      return sortedDates.map(date => ({ date, count: orderCounts[date] }));
    };

    const createChart = () => {
      if (!canvas.value) return;

      const labels = ordersData.value.map(data => data.date);
      const data = ordersData.value.map(data => data.count);

      new Chart(canvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Nombre de commandes',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
              type: 'category' // Changer 'time' à 'category' pour éviter les erreurs de format de date
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    onMounted(() => {
      fetchOrdersData();
    });

    return {
      canvas
    };
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
