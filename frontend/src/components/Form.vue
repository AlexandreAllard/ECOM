<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in fields" :key="field.name">
      <label :for="field.name">{{ field.label }}</label>
      <input
          :id="field.name"
          :type="field.type || 'text'"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
      />
      <span v-if="errors[field.name]" class="error">{{ errors[field.name] }}</span>
    </div>
    <button type="submit" :disabled="isLoading">Submit</button>
    <p v-if="isSuccess" class="success">Form submitted successfully!</p>
    <p v-if="serverError" class="error">{{ serverError }}</p>
  </form>
</template>

<script setup>
import { useForm } from '../composables/useForm';
import { ref, watch } from 'vue';

const props = defineProps({
  initialData: Object,
  fields: Array,
  submitUrl: String,
  method: String,
  schema: Object
});

const { formData, errors, isLoading, serverError, isSuccess, handleSubmit } = useForm(props.initialData, props.schema, props.submitUrl, props.method);

watch(() => props.initialData, (newData) => {
  for (const key in newData) {
    formData[key] = newData[key];
  }
}, { deep: true });
</script>
