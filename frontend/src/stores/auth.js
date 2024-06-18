import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null,
        token: null,
        role: null
    }),
    actions: {
        initialiseStore() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                this.validateToken();
            } else {
                this.resetAuth();
            }
        },
        validateToken() {
            if (!this.token) {
                this.resetAuth();
                return Promise.reject("No token found");
            }
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
            this.token = null;
            this.user = null;
            this.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            delete axios.defaults.headers.common['Authorization'];
        },
        login(credentials) {
            return axios.post('http://localhost:3000/auth/login', credentials)
                .then(response => {
                    this.token = response.data.token;
                    this.isLoggedIn = true;
                    this.role = response.data.user.role;
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('role', this.role);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                    return null;
                })
                .catch(error => {
                    console.error('Login failed:', error);
                    return error.response ? error.response.data.message : 'Login failed';
                });
        },
        logout() {
            this.resetAuth();
        }
    }
});
