<template>
  <div>
    <DataTable
        :data="products"
        :columns="columns"
        title="Produits"
        :editable-fields="['name', 'brand', 'price', 'stock']"
        :create-fields="['name', 'brand', 'price', 'stock', 'description', 'categoryId']"
        :submit-url="submitUrl"
        :method="'patch'"
        @update="fetchProducts"
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
    const productSchema = z.object({
      name: z.string().nonempty({message: "Le nom est requis"}),
    });

    const initialValues = {name: '', brand: '', price: '', stock: '', description: '', categoryId: ''};
    const {formData, errors, isLoading, serverError, isSuccess, handleSubmit} = useForm(
        initialValues,
        productSchema,
        `${import.meta.env.VITE_API_ENDPOINT}:3000/productss/`
    );

    return {
      productSchema,
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
      products: [],
      columns: [
        {name: 'Nom', field: 'name'},
        {name: 'Marque', field: 'brand'},
        {name: 'Prix', field: 'price'},
        {name: 'Stock', field: 'stock'},
        {name: 'Description', field: 'description'},
        {name: 'Catégorie', field: 'categoryId'}
      ],
      submitUrl: `${import.meta.env.VITE_API_ENDPOINT}:3000/productss/`
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss`, {withCredentials: true});
        this.products = response.data;
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    },
    handleEdit(product) {
      console.log('Edit product', product);
      this.formData.name = product.name;
      this.formData.brand = product.brand;
      this.formData.price = product.price;
      this.formData.stock = product.stock;
      this.formData.description = product.description;
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
