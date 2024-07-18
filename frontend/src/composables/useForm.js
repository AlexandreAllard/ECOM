import { reactive, ref, watchEffect } from 'vue';
import axios from 'axios';

export function useForm(initialValues, schema, submitUrl, method = 'post') {
    const formData = reactive(initialValues);
    const errors = reactive({});
    const isLoading = ref(false);
    const serverError = ref(null);
    const isSuccess = ref(false);

    const validate = () => {
        try {
            schema.parse(formData);
            Object.keys(errors).forEach(key => errors[key] = null);
        } catch (e) {
            e.errors.forEach(error => {
                errors[error.path[0]] = error.message;
            });
        }
    };

    watchEffect(() => {
        validate();
    });

    const handleSubmit = async () => {
        if (Object.values(errors).some(err => err !== null)) {
            return;
        }

        isLoading.value = true;
        serverError.value = null;
        isSuccess.value = false;

        try {
            const response = await axios({
                method,
                url: submitUrl,
                data: formData,
                withCredentials: true
            });
            isSuccess.value = true;
            return response.data; // Ensuring response data is returned
        } catch (error) {
            serverError.value = error.response?.data?.message || "An error occurred";
        } finally {
            isLoading.value = false;
        }
    };

    return { formData, errors, isLoading, serverError, isSuccess, handleSubmit };
}
