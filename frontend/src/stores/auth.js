// store/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null,
        token: null,
    }),
    actions: {
        initialiseStore() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                this.isLoggedIn = false;
                this.token = null;
            }
        },
        login(credentials) {
            return axios.post('http://localhost:3000/auth/login', credentials)
                .then(response => {
                    this.token = response.data.token;
                    this.isLoggedIn = true;
                    localStorage.setItem('token', this.token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                    return null;
                })
                .catch(error => {
                    console.error('Login failed:', error);
                    return error.response ? error.response.data.message : 'Login failed';
                });
        },
        logout() {
            this.isLoggedIn = false;
            this.token = null;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
});
