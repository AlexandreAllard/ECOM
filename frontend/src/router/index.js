import { createRouter, createWebHistory } from 'vue-router';
import {useAuthStore} from "../stores/auth.js";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }

    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if (to.matched.some(record => record.meta.requiresAuth) && !auth.isLoggedIn) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
