// ============================================================
// NAVBAR COMPONENT
// ============================================================

import router from '../router.js';

export default {
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    methods: {
        logout() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                // Clear localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
                
                // Redirect to login
                router.push('/login');
                
                // Reload to reset app state
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        },
        isActive(route) {
            return router.currentRoute.value.path === route;
        },
        getUserInitial() {
            return this.user?.full_name?.charAt(0)?.toUpperCase() || 'U';
        }
    },
    template: `
        <nav class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-center h-16">
                    <!-- Brand -->
                    <div class="flex items-center">
                        <div class="bg-indigo-100 p-2 rounded-lg">
                            <i class="fas fa-boxes text-indigo-600 text-xl"></i>
                        </div>
                        <span class="ml-3 font-bold text-xl text-gray-800">E-Inventory</span>
                        <span class="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">v1.0</span>
                    </div>
                    
                    <!-- Navigation Links -->
                    <div class="hidden md:flex space-x-1">
                        <router-link to="/dashboard" class="sidebar-link" :class="{ active: isActive('/dashboard') || isActive('/') }">
                            <i class="fas fa-chart-pie mr-2"></i> Dashboard
                        </router-link>
                        <router-link to="/products" class="sidebar-link" :class="{ active: isActive('/products') }">
                            <i class="fas fa-cube mr-2"></i> Produk
                        </router-link>
                        <router-link to="/categories" class="sidebar-link" :class="{ active: isActive('/categories') }">
                            <i class="fas fa-tags mr-2"></i> Kategori
                        </router-link>
                        <router-link to="/suppliers" class="sidebar-link" :class="{ active: isActive('/suppliers') }">
                            <i class="fas fa-truck mr-2"></i> Supplier
                        </router-link>
                    </div>
                    
                    <!-- User Menu -->
                    <div class="flex items-center space-x-4">
                        <!-- User Info -->
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                                {{ getUserInitial() }}
                            </div>
                            <div class="hidden sm:block">
                                <p class="text-sm font-medium text-gray-800">{{ user?.full_name || 'User' }}</p>
                                <p class="text-xs text-gray-500">{{ user?.role || '' }}</p>
                            </div>
                        </div>
                        
                        <!-- Logout Button -->
                        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                            <i class="fas fa-sign-out-alt mr-1"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `
};