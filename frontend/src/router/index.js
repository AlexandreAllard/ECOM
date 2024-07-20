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
                path: 'orders',
                name: 'AdminOrders',
                component: () => import('../views/admin/AdminOrders.vue')
            }
        ]
    },
    {
        path: '/activate/:token',
        name: 'ActivateAccount',
        component: () => import('../views/ActivateAccount.vue')
    },
    {
        path:'/resend-verification',
        name: 'ResendVerification',
        component: () => import('../views/ResendVerification.vue')
    },
    {
        path:'/reset-password-request',
        name: 'ResetPasswordRequest',
        component: () => import('../views/RequestResetPassword.vue')
    },
    {
        path:'/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('../views/ResetPassword.vue')
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
        component: () => import('../views/ProductDetails2.vue')
    },
    {
        path: '/stock',
        component: () => import('../views/stock/Stock.vue'),
        meta: {requiresAuth: true, requiresRole: ['storekeeper','admin']},
        children: [
            {
                path: 'history',
                name: 'StockHistory',
                component: () => import('../views/stock/StockHistory.vue')
            },
            {
                path: 'management',
                name: 'StockManagement',
                component: () => import('../views/stock/StockManagement.vue')
            }
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
        path:'/orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue'),
    },
    {
        path:'/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
    },
    {
        path:'/loginnew',
        name: 'LoginNew',
        component: () => import('../views/LoginNew.vue'),
    },
    {
        path:'/profilenew',
        name: 'ProfileNew',
        component: () => import('../views/ProfileNew.vue'),
    },
    {
        path:'/adminusers',
        name: 'AdminUsers',
        component: () => import('../views/AdminUsers.vue'),
    },
    {
        path:'/admincategories',
        name: 'AdminCategories',
        component: () => import('../views/AdminCategories.vue'),
    },
    {
        path:'/adminproducts',
        name: 'AdminProducts',
        component: () => import('../views/AdminProducts.vue'),
    },
    {
        path:'/stockmanagement',
        name: 'StockManagement',
        component: () => import('../views/StockManagement.vue'),
    },
    {
        path:'/stockhistory',
        name: 'StockHistory',
        component: () => import('../views/StockHistory.vue'),
    },
    {
        path:'/ordermanagement',
        name: 'OrderManagement',
        component: () => import('../views/OrderManagement.vue'),
    },
    {
        path:'/deliverymanagement',
        name: 'DeliveryManagement',
        component: () => import('../views/DeliveryManagement.vue'),
    },
    {
        path:'/productss',
        name: 'Productss',
        component: () => import('../views/Productss.vue'),
    },
    {
        path:'/cartss',
        name: 'Cart',
        component: () => import('../views/Carts.vue'),
    },
    {
        path:'/categories',
        name: 'Categories',
        component: () => import('../views/Categories.vue'),
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
