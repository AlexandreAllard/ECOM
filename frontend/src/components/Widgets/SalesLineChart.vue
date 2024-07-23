<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {Chart, registerables} from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
  name: 'SalesLineChart',
  setup() {
    const canvas = ref(null);
    const salesData = ref([]);

    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss/search`, {withCredentials: true});
        salesData.value = processSalesData(response.data);
        createChart();
      } catch (error) {
        console.error("Erreur lors de la récupération des données de vente:", error);
      }
    };

    const processSalesData = (orders) => {
      const sales = {};

      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!sales[date]) {
          sales[date] = 0;
        }
        sales[date] += parseFloat(order.total);
      });

      const sortedDates = Object.keys(sales).sort((a, b) => new Date(a) - new Date(b));
      return sortedDates.map(date => ({date, totalSales: sales[date]}));
    };

    const createChart = () => {
      if (!canvas.value) return;

      const labels = salesData.value.map(data => data.date);
      const data = salesData.value.map(data => data.totalSales);

      new Chart(canvas.value, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Chiffre d\'affaires',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    onMounted(() => {
      fetchSalesData();
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
