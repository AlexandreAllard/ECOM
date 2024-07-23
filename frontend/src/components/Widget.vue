<template>
  <div class="widget">
    <div class="header">{{ title }}</div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.widget {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  font-weight: bold;
  margin-bottom: 10px;
}

.content {
  flex-grow: 1;
}
</style>
