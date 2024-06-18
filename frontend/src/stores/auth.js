import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null,
        role: null
    }),
    actions: {
        initialiseStore() {
            this.validateToken();
        },
        validateToken() {
            return axios.get('http://localhost:3000/auth/validate-token', { withCredentials: true })
                .then(response => {
                    this.isLoggedIn = true;
                    this.user = response.data.user;
                    this.role = response.data.user.role;
                    return response.data;
                })
                .catch(error => {
                    this.resetAuth();
                    return Promise.reject(error);
                });
        },
        resetAuth() {
            this.isLoggedIn = false;
            this.user = null;
            this.role = null;
        },
        login(credentials) {
            return axios.post('http://localhost:3000/auth/login', credentials, { withCredentials: true })
                .then(response => {
                    this.isLoggedIn = true;
                    this.user = response.data.user;
                    this.role = response.data.user.role;
                    return null;
                })
                .catch(error => {
                    console.error('Login failed:', error);
                    return error.response ? error.response.data.message : 'Login failed';
                });
        },
        logout() {
            return axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true })
                .then(() => {
                    this.resetAuth();
                })
                .catch(error => {
                    console.error('Logout failed:', error);
                });
        }
    }
});
