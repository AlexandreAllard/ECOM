<template>
  <div>
    <DataTable
        :data="users"
        :columns="columns"
        title="Utilisateurs"
        :editable-fields="['lastname', 'firstname', 'email', 'role']"
        :create-fields="['lastname', 'firstname', 'email', 'password']"
        :submit-url="submitUrl"
        :method="'patch'"
        @update="fetchUsers"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { z } from 'zod';
import DataTable from '../components/Table/DataTable.vue';
import { useForm } from '../composables/useForm';

export default {
  components: {
    DataTable
  },
  setup() {
    const userSchema = z.object({
      lastname: z.string().nonempty({message: "Le nom est requis"}),
      firstname: z.string().nonempty({message: "Le prénom est requis"}),
      email: z.string().email({message: "Email invalide"})
    });

    const initialValues = {name: '', email: ''};
    const {formData, errors, isLoading, serverError, isSuccess, handleSubmit} = useForm(
        initialValues,
        userSchema,
        "http://localhost:3000/userss/"
    );

    return {
      userSchema,
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
      users: [],
      columns: [
        {name: 'Nom', field: 'lastname'},
        {name: 'Prénom', field: 'firstname'},
        {name: 'Email', field: 'email'},
        {name: 'Rôle', field: 'role'}
      ],
      submitUrl: "http://localhost:3000/userss/"
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/userss', {withCredentials: true});
        this.users = response.data;
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    },
    handleEdit(user) {
      console.log('Edit user', user);
      this.formData.firstname = user.firstname;
      this.formData.lastname = user.lastname;
      this.formData.email = user.email;
      this.formData.role = user.role;
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
