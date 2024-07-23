import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from "../stores/auth.js";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/produits',
        name: 'Produits',
        component: () => import('../views/Products.vue'),
    },
    {
        path: '/admin',
        component: () => import('../views/admin/Admin.vue'),
        meta: {requiresAuth: true, requiresRole: 'admin'},
        children: [
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('../views/admin/AdminUsers.vue')
            },
            {
                path: 'categories',
                name: 'AdminCategories',
                component: () => import('../views/admin/AdminCategories.vue')
            },
            {
                path: 'products',
                name: 'AdminProducts',
                component: () => import('../views/admin/AdminProducts.vue')
            },
            {
                path:'cgv',
                name: 'AdminCGV',
                component: () => import('../views/admin/AdminCGV.vue'),
            },
            {
                path:'mentions-legales',
                name: 'AdminMentionsLegales',
                component: () => import('../views/admin/AdminMentionsLegales.vue'),
            }
        ]
    },
    {
        path: '/auth',
        component: () => import('../views/authentication/Auth.vue'),
        children: [
            {
                path: 'activate/:token',
                name: 'ActivateAccount',
                component: () => import('../views/authentication/ActivateAccount.vue')
            },
            {
                path:'resend-verification',
                name: 'ResendVerification',
                component: () => import('../views/authentication/ResendVerification.vue')
            },
            {
                path:'reset-password-request',
                name: 'ResetPasswordRequest',
                component: () => import('../views/authentication/RequestResetPassword.vue')
            },
            {
                path:'reset-password/:token',
                name: 'ResetPassword',
                component: () => import('../views/authentication/ResetPassword.vue')
            },
            {
                path:'register',
                name: 'Register',
                component: () => import('../views/authentication/Register.vue'),
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('../views/authentication/LoginNew.vue')
            },
        ]
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
    },
    {
        path: '/management',
        component: () => import('../views/management/Management.vue'),
        meta: {requiresAuth: true, requiresRole: ['storekeeper','admin']},
        children: [
            {
                path: 'stock-history',
                name: 'StockHistory',
                component: () => import('../views/management/StockHistory.vue')
            },
            {
                path: 'stock',
                name: 'StockManagement',
                component: () => import('../views/management/StockManagement.vue')
            },
            {
                path:'order',
                name: 'OrderManagement',
                component: () => import('../views/management/OrderManagement.vue'),
            },
            {
                path:'delivery',
                name: 'DeliveryManagement',
                component: () => import('../views/management/DeliveryManagement.vue'),
            },
        ]
    },
    {
        path:'/payment',
        name: 'Payment',
        component: () => import('../views/Payment.vue'),
    },
    {
        path:'/payment-success',
        name: 'PaymentSuccess',
        component: () => import('../views/PaymentSuccess.vue'),
    },
    {
        path:'/categories',
        name: 'Categories',
        component: () => import('../views/Categories.vue'),
    },
    {
        path:'/cgv',
        name: 'CGV',
        component: () => import('../views/CGV.vue'),
    },
    {
        path:'/mentions-legales',
        name: 'MentionsLegales',
        component: () => import('../views/MentionsLegales.vue'),
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
            const routeRequiresRoles = to.matched.some(record => record.meta.requiresRole);
            if (routeRequiresRoles) {
                const roles = to.matched.find(record => record.meta.requiresRole)?.meta.requiresRole || [];
                if (!roles.includes(auth.role)) {
                    next({name: 'Home'});
                    return;
                }
            }
            next();
        } catch (error) {
            next({name: 'Login'});
        }
    } else {
        next();
    }
});

export default router;
