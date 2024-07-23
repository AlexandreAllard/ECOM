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
  name: 'ProductsPieChart',
  setup() {
    const canvas = ref(null);
    const productsData = ref([]);

    const fetchProductsData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss`, { withCredentials: true });
        productsData.value = processProductsData(response.data);
        createChart();
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    const processProductsData = (orders) => {
      const productCounts = {};

      orders.forEach(order => {
        order.items.forEach(item => {
          const productName = item.product ? item.product.name : 'Produit inconnu';
          if (!productCounts[productName]) {
            productCounts[productName] = 0;
          }
          productCounts[productName] += item.quantity;
        });
      });

      return Object.entries(productCounts).map(([name, count]) => ({ name, count }));
    };

    const createChart = () => {
      if (!canvas.value) return;

      const labels = productsData.value.map(data => data.name);
      const data = productsData.value.map(data => data.count);

      new Chart(canvas.value, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Produits vendus',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw} unités`;
                }
              }
            }
          }
        }
      });
    };

    onMounted(() => {
      fetchProductsData();
    });

    return {
      canvas
    };
  }
};
</script>

<style scoped>
canvas {
  width: 400px !important;
  height: 400px !important;
}
</style>
