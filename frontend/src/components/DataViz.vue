<template>
  <div class="chart-container" style="position: relative; height:40vh; width:80vw">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'DataViz',
  data() {
    return {
      chart: null,
      apiUrl: 'http://localhost:3000/orders/all-orders'
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get(this.apiUrl, {withCredentials: true});
        const chartData = this.prepareChartData(response.data);
        this.renderChart(chartData);
      } catch (error) {
        console.error('Error fetching orders from:', this.apiUrl, error);
      }
    },
    prepareChartData(orders) {
      const salesData = orders.reduce((acc, order) => {
        const orderDate = new Date(order.createdAt);
        const date = new Date(orderDate.getTime() - (orderDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += parseFloat(order.total);
        return acc;
      }, {});

      return {
        labels: Object.keys(salesData).sort(),
        datasets: [{
          label: 'Daily Sales',
          data: Object.values(salesData),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    },
    renderChart(chartData) {
      const ctx = this.$refs.canvas.getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
};
</script>

<style>
.chart-container {
  width: 100%;
  margin: auto;
  background-color: white;
}
</style>
