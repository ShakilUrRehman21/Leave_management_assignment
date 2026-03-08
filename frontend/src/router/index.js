import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading views
const Login = () => import('../pages/Login.vue');
const Register = () => import('../pages/Register.vue');
const EmployeeDashboard = () => import('../pages/EmployeeDashboard.vue');
const EmployerDashboard = () => import('../pages/EmployerDashboard.vue');

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
        path: '/employee',
        name: 'Employee',
        component: EmployeeDashboard,
        meta: { requiresAuth: true, role: 'employee' }
    },
    {
        path: '/employer',
        name: 'Employer',
        component: EmployerDashboard,
        meta: { requiresAuth: true, role: 'employer' }
    },
    // Catch all 404
    { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;

    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
        }
    }

    // If route requires authentication
    if (to.meta.requiresAuth) {
        if (!token || !user) {
            return next('/login');
        }
        // Check role based authorization
        if (to.meta.role && to.meta.role !== user.role) {
            return next(user.role === 'employer' ? '/employer' : '/employee');
        }
    } else if (token && user && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
        // If logged in user tries to visit login/register, redirect to their dashboard
        return next(user.role === 'employer' ? '/employer' : '/employee');
    }

    next();
});

export default router;
