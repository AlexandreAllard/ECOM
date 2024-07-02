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
        component: () => import('../views/admin/Admin.vue'),
        meta: {requiresAuth: true, requiresRole: 'admin'}
    },
    {
        path: '/produits',
        name: 'Produits',
        component: () => import('../views/Products.vue'),

    },
    {
        path: '/adminusers',
        name: 'AdminUsers',
        component: () => import('../views/admin/AdminUsers.vue'),
        meta: {requiresAuth: true, requiresRole: 'admin'}
    },
    {
        path: '/admincategories',
        name: 'AdminCategories',
        component: () => import('../views/admin/AdminCategories.vue'),
        meta: {requiresAuth: true, requiresRole: 'admin'}
    },
    {
        path: '/adminproducts',
        name: 'AdminProducts',
        component: () => import('../views/admin/AdminProducts.vue'),
        meta: {requiresAuth: true, requiresRole: 'admin'}
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/Cart.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/product/:id',
        name: 'ProductDetails',
        component: () => import('../views/ProductDetails.vue')
    }
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
                next({name: 'Home'});
            } else {
                next();
            }
        } catch (error) {
            next({name: 'Login'});
        }
    } else {
        next();
    }
});

export default router;
