<template>
  <div>
    <DataTable
        :data="categories"
        :columns="columns"
        title="Catégories"
        :editable-fields="['name']"
        :create-fields="['name']"
        :submit-url="submitUrl"
        :method="'patch'"
        @update="fetchCategories"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { z } from 'zod';
import DataTable from '../../components/Table/DataTable.vue';
import { useForm } from '../../composables/useForm';

export default {
  components: {
    DataTable
  },
  setup() {
    const categorySchema = z.object({
      name: z.string().nonempty({message: "Le nom est requis"}),
    });

    const initialValues = {name: ''};
    const {formData, errors, isLoading, serverError, isSuccess, handleSubmit} = useForm(
        initialValues,
        categorySchema,
        `${import.meta.env.VITE_API_ENDPOINT}:3000/categoriess/`
    );

    return {
      categorySchema,
      formData,
      errors,
      isLoading,
      serverError,
      isSuccess,
      handleSubmit
    };
  },
  data() {
    return {
      categories: [],
      columns: [
        {name: 'Nom', field: 'name'},
        {name: 'ID', field: 'id'}
      ],
      submitUrl: `${import.meta.env.VITE_API_ENDPOINT}:3000/categoriess/`
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/categoriess`, {withCredentials: true});
        this.categories = response.data;
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    },
    handleEdit(category) {
      console.log('Edit category', category);
      this.formData.name = category.name;
    },
    updateFormData(newFormData) {
      this.formData = newFormData;
    },
    updateIsLoading(newIsLoading) {
      this.isLoading = newIsLoading;
    },
    updateErrors(newErrors) {
      this.errors = newErrors;
    },
    updateServerError(newServerError) {
      this.serverError = newServerError;
    },
    updateIsSuccess(newIsSuccess) {
      this.isSuccess = newIsSuccess;
    }
  }
};
</script>
