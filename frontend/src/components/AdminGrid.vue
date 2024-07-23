<template>
  <GridLayout v-model:layout="layout" :row-height="30">
    <template #item="{ item }">
      <Widget :title="`${item.i}`">
        <RefundWidget />
      </Widget>
    </template>
  </GridLayout>
</template>

<script setup>
import {reactive} from 'vue'
import {GridLayout, GridItem} from 'grid-layout-plus'
import Widget from "./Widget.vue";
import RefundWidget from "./Widgets/RefundWidget.vue";


const layout = reactive([
  {x: 0, y: 0, w: 2, h: 2, i: '0', static: false},
  {x: 2, y: 0, w: 2, h: 4, i: '1', static: false},
  {x: 4, y: 0, w: 2, h: 5, i: '2', static: false},
  {x: 6, y: 0, w: 2, h: 3, i: '3', static: false},
  {x: 8, y: 0, w: 2, h: 3, i: '4', static: false},
  {x: 10, y: 0, w: 2, h: 3, i: '5', static: false},
  {x: 0, y: 5, w: 2, h: 5, i: '6', static: false},
  {x: 2, y: 5, w: 2, h: 5, i: '7', static: false},
])
</script>

<style scoped>
.vgl-layout {
  background-color: #eee;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
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
}
</style>
