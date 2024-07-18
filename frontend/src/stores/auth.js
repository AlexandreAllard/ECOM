import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null,
        role: null,
        id: null
    }),
    actions: {
        initialiseStore() {
            this.validateToken();
        },
        validateToken() {
            return axios.get('http://localhost:3000/auths/validate-token', { withCredentials: true })
                .then(response => {
                    this.isLoggedIn = true;
                    return this.getProfile();
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
            return axios.post('http://localhost:3000/auths/login', credentials, { withCredentials: true })
                .then(response => {
                    this.isLoggedIn = true;
                    localStorage.setItem('id', response.data.id);
                    this.id=response.data.id;
                    return null;
                })
                .then(() => this.getProfile())
                .catch(error => {
                    console.error('Login failed:', error);
                    return error.response ? error.response.data.message : 'Login failed';
                });
        },
        getProfile() {
            const userId = localStorage.getItem('id');
            if (!userId) {
                return Promise.reject('No user ID found');
            }
            return axios.get(`http://localhost:3000/userss/${userId}`, { withCredentials: true })
                .then(response => {
                    this.user = response.data;
                    this.role = response.data.role;
                    localStorage.setItem('id', response.data.id);
                    this.id=response.data.id;
                    this.isLoggedIn = true;
                    return null;
                })
                .catch(error => {
                    console.error('Failed to fetch user profile:', error);
                    return Promise.reject(error);
                });
        },
        logout() {
            return axios.post('http://localhost:3000/auths/logout', {}, { withCredentials: true })
                .then(() => {
                    this.resetAuth();
                })
                .catch(error => {
                    console.error('Logout failed:', error);
                });
        }
    }
});
