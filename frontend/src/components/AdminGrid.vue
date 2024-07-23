<template>
  <GridLayout v-model:layout="layout" :row-height="30">
    <template #item="{ item }">
      <Widget :title="''">
        <component :is="getComponent(item.i)" />
      </Widget>
    </template>
  </GridLayout>
</template>

<script setup>
import {reactive} from 'vue';
import {GridLayout, GridItem} from 'grid-layout-plus';
import Widget from './Widget.vue';
import RefundWidget from './Widgets/RefundWidget.vue';
import OrdersBarChart from './Widgets/OrdersBarChart.vue';
import ProductsPieChart from './Widgets/ProductsPieChart.vue';

const layout = reactive([
  {x: 0, y: 0, w: 1, h: 3, i: '0', static: false},
  {x: 1, y: 0, w: 7, h: 11, i: '1', static: false},
  {x: 8, y: 0, w: 4, h: 11, i: '2', static: false},

]);

const getComponent = (i) => {
  switch (i) {
    case '0':
      return RefundWidget;
    case '1':
      return OrdersBarChart;
    case '2':
      return ProductsPieChart;
    default:
      return null;
  }
};
</script>

<style scoped>
.vgl-layout {
  width: 90%;
  margin: 0 auto;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
  padding: 0 !important;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
  padding: 0 !important;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
  padding: 0 !important;
}
</style>
