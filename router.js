import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import ProductList from './components/ProductList.js';
import CategoryList from './components/CategoryList.js';
import SupplierList from './components/SupplierList.js';

const routes = [
    { path: '/login', component: Login, meta: { requiresGuest: true } },
    { path: '/', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/products', component: ProductList, meta: { requiresAuth: true } },
    { path: '/categories', component: CategoryList, meta: { requiresAuth: true } },
    { path: '/suppliers', component: SupplierList, meta: { requiresAuth: true } }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login');
    } else if (to.meta.requiresGuest && isLoggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router;