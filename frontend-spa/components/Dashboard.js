// ============================================================
// DASHBOARD COMPONENT
// ============================================================

import axios from '../axios.js';

export default {
    data() {
        return {
            stats: {
                totalProducts: 0,
                totalCategories: 0,
                totalSuppliers: 0,
                lowStock: 0,
                totalValue: 0
            },
            recentProducts: [],
            loading: true,
            error: null
        };
    },
    async mounted() {
        await this.loadDashboardData();
    },
    methods: {
        async loadDashboardData() {
            this.loading = true;
            this.error = null;
            
            try {
                const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
                    axios.get('/product'),
                    axios.get('/category'),
                    axios.get('/supplier')
                ]);
                
                const products = productsRes.data.data || [];
                const categories = categoriesRes.data.data || [];
                const suppliers = suppliersRes.data.data || [];
                
                // Calculate stats
                this.stats.totalProducts = products.length;
                this.stats.totalCategories = categories.length;
                this.stats.totalSuppliers = suppliers.length;
                this.stats.lowStock = products.filter(p => p.stock <= p.min_stock).length;
                this.stats.totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
                
                // Get 5 most recent products
                this.recentProducts = products.slice(0, 5);
                
            } catch (error) {
                console.error('Error loading dashboard:', error);
                this.error = 'Gagal memuat data dashboard';
            } finally {
                this.loading = false;
            }
        },
        getStockColor(stock, minStock) {
            if (stock <= 0) return 'text-red-600';
            if (stock <= minStock) return 'text-yellow-600';
            return 'text-green-600';
        },
        formatCurrency(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        }
    },
    template: `
        <div class="container mx-auto px-4 py-8">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p class="text-gray-500 mt-1">Ringkasan data inventaris Anda</p>
            </div>
            
            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger fade-in">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ error }}
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="stat-card slide-in">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Total Produk</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.totalProducts }}</p>
                        </div>
                        <div class="stat-icon bg-blue-100">
                            <i class="fas fa-cube text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card slide-in" style="animation-delay: 0.05s">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Kategori</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.totalCategories }}</p>
                        </div>
                        <div class="stat-icon bg-green-100">
                            <i class="fas fa-tags text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card slide-in" style="animation-delay: 0.1s">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Supplier</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.totalSuppliers }}</p>
                        </div>
                        <div class="stat-icon bg-purple-100">
                            <i class="fas fa-truck text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card slide-in" style="animation-delay: 0.15s">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Stok Menipis</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.lowStock }}</p>
                        </div>
                        <div class="stat-icon bg-red-100">
                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Additional Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Total Nilai Inventaris</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatCurrency(stats.totalValue) }}</p>
                        </div>
                        <div class="stat-icon bg-indigo-100">
                            <i class="fas fa-money-bill-wave text-indigo-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500">Rata-rata Stok per Produk</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">
                                {{ stats.totalProducts > 0 ? Math.round(stats.totalProducts / stats.totalProducts) : 0 }}
                            </p>
                        </div>
                        <div class="stat-icon bg-yellow-100">
                            <i class="fas fa-chart-bar text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Products -->
            <div class="card p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">
                        <i class="fas fa-clock mr-2 text-indigo-600"></i>Produk Terbaru
                    </h3>
                    <router-link to="/products" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Lihat Semua <i class="fas fa-arrow-right ml-1"></i>
                    </router-link>
                </div>
                
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-2xl text-indigo-600"></i>
                    <p class="text-gray-500 mt-2">Memuat data...</p>
                </div>
                
                <!-- Empty State -->
                <div v-else-if="recentProducts.length === 0" class="text-center py-8">
                    <i class="fas fa-inbox text-4xl text-gray-300 mb-3 block"></i>
                    <p class="text-gray-500">Belum ada produk</p>
                </div>
                
                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="table-header">Kode</th>
                                <th class="table-header">Nama</th>
                                <th class="table-header">Kategori</th>
                                <th class="table-header">Stok</th>
                                <th class="table-header">Harga</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="product in recentProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
                                <td class="table-cell font-medium text-gray-900">{{ product.code }}</td>
                                <td class="table-cell text-gray-700">{{ product.name }}</td>
                                <td class="table-cell text-gray-500">{{ product.category_name || '-' }}</td>
                                <td class="table-cell">
                                    <span :class="getStockColor(product.stock, product.min_stock)">
                                        {{ product.stock }}
                                        <span v-if="product.stock <= product.min_stock" class="ml-1 badge badge-danger text-xs">Low</span>
                                    </span>
                                </td>
                                <td class="table-cell text-gray-700">{{ formatCurrency(product.price) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};