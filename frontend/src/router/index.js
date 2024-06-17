import {createRouter, createWebHistory} from 'vue-router';
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
        meta: {requiresAuth: true}
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/Admin.vue'),
        meta: {requiresAuth: true, requiresRole: 'admin'}
    },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            await auth.validateToken();
            if (to.matched.some(record => record.meta.requiresRole && auth.role !== record.meta.requiresRole)) {
                next({ name: 'Home' });
            } else {
                next();
            }
        } catch (error) {
            next({ name: 'Login' });
        }
    } else {
        next();
    }
});

export default router;
