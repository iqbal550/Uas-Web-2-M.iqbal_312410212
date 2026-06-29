// ============================================================
// PRODUCT LIST COMPONENT
// ============================================================

import axios from '../axios.js';

export default {
    data() {
        return {
            products: [],
            categories: [],
            suppliers: [],
            loading: true,
            showModal: false,
            isEditing: false,
            searchKeyword: '',
            form: {
                id: null,
                code: '',
                name: '',
                description: '',
                category_id: '',
                supplier_id: '',
                price: 0,
                stock: 0,
                min_stock: 5,
                status: 'active'
            },
            submitting: false
        };
    },
    computed: {
        filteredProducts() {
            if (!this.searchKeyword) return this.products;
            const keyword = this.searchKeyword.toLowerCase();
            return this.products.filter(p => 
                p.name.toLowerCase().includes(keyword) ||
                p.code.toLowerCase().includes(keyword) ||
                (p.description && p.description.toLowerCase().includes(keyword))
            );
        }
    },
    async mounted() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            this.loading = true;
            try {
                const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
                    axios.get('/product'),
                    axios.get('/category'),
                    axios.get('/supplier')
                ]);
                
                this.products = productsRes.data.data || [];
                this.categories = categoriesRes.data.data || [];
                this.suppliers = suppliersRes.data.data || [];
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Gagal memuat data produk');
            } finally {
                this.loading = false;
            }
        },
        openModal(product = null) {
            this.isEditing = !!product;
            this.form = product ? { ...product } : {
                id: null,
                code: '',
                name: '',
                description: '',
                category_id: '',
                supplier_id: '',
                price: 0,
                stock: 0,
                min_stock: 5,
                status: 'active'
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.isEditing = false;
            this.form = {
                id: null,
                code: '',
                name: '',
                description: '',
                category_id: '',
                supplier_id: '',
                price: 0,
                stock: 0,
                min_stock: 5,
                status: 'active'
            };
        },
        async saveProduct() {
            if (!this.form.name) {
                alert('Nama produk harus diisi!');
                return;
            }
            
            this.submitting = true;
            
            try {
                let response;
                if (this.isEditing) {
                    response = await axios.put(`/product/${this.form.id}`, this.form);
                } else {
                    response = await axios.post('/product', this.form);
                }
                
                if (response.data.status) {
                    alert(this.isEditing ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan');
                    this.closeModal();
                    await this.loadData();
                } else {
                    alert(response.data.message || 'Gagal menyimpan produk');
                }
            } catch (error) {
                console.error('Error saving product:', error);
                alert('Terjadi kesalahan saat menyimpan produk');
            } finally {
                this.submitting = false;
            }
        },
        async deleteProduct(id) {
            if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
            
            try {
                const response = await axios.delete(`/product/${id}`);
                if (response.data.status) {
                    alert('Produk berhasil dihapus');
                    await this.loadData();
                } else {
                    alert(response.data.message || 'Gagal menghapus produk');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Terjadi kesalahan saat menghapus produk');
            }
        },
        getCategoryName(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            return category ? category.name : '-';
        },
        getSupplierName(supplierId) {
            const supplier = this.suppliers.find(s => s.id === supplierId);
            return supplier ? supplier.name : '-';
        },
        formatCurrency(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        }
    },
    template: `
        <div class="container mx-auto px-4 py-8">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
                    <p class="text-gray-500 mt-1">Kelola data produk inventaris</p>
                </div>
                <button @click="openModal()" class="btn-primary whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>Tambah Produk
                </button>
            </div>
            
            <!-- Search -->
            <div class="mb-6">
                <div class="relative max-w-md">
                    <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input 
                        v-model="searchKeyword" 
                        type="text" 
                        placeholder="Cari produk berdasarkan nama atau kode..." 
                        class="input-field pl-10"
                    >
                </div>
            </div>
            
            <!-- Table -->
            <div class="card overflow-hidden">
                <!-- Loading -->
                <div v-if="loading" class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
                    <p class="text-gray-500 mt-3">Memuat data...</p>
                </div>
                
                <!-- Empty -->
                <div v-else-if="products.length === 0" class="text-center py-12">
                    <i class="fas fa-inbox text-5xl text-gray-300 mb-4 block"></i>
                    <p class="text-gray-500">Belum ada produk</p>
                    <button @click="openModal()" class="btn-primary mt-4">
                        <i class="fas fa-plus mr-2"></i>Tambah Produk Pertama
                    </button>
                </div>
                
                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="table-header">Kode</th>
                                <th class="table-header">Nama</th>
                                <th class="table-header">Kategori</th>
                                <th class="table-header">Supplier</th>
                                <th class="table-header">Stok</th>
                                <th class="table-header">Harga</th>
                                <th class="table-header">Status</th>
                                <th class="table-header text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
                                <td class="table-cell font-medium text-gray-900">{{ product.code }}</td>
                                <td class="table-cell text-gray-700">{{ product.name }}</td>
                                <td class="table-cell text-gray-500">{{ getCategoryName(product.category_id) }}</td>
                                <td class="table-cell text-gray-500">{{ getSupplierName(product.supplier_id) }}</td>
                                <td class="table-cell">
                                    <span :class="product.stock <= product.min_stock ? 'text-red-600 font-semibold' : 'text-gray-700'">
                                        {{ product.stock }}
                                    </span>
                                    <span v-if="product.stock <= product.min_stock" class="ml-1 badge badge-danger text-xs">Low</span>
                                </td>
                                <td class="table-cell text-gray-700">{{ formatCurrency(product.price) }}</td>
                                <td class="table-cell">
                                    <span :class="product.status === 'active' ? 'badge-success' : 'badge-gray'" class="badge">
                                        {{ product.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                    </span>
                                </td>
                                <td class="table-cell text-center">
                                    <div class="flex justify-center space-x-2">
                                        <button @click="openModal(product)" class="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-800 transition-colors" title="Hapus">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <!-- Search result count -->
                    <div v-if="searchKeyword && filteredProducts.length > 0" class="px-6 py-3 text-sm text-gray-500 border-t">
                        Menampilkan {{ filteredProducts.length }} dari {{ products.length }} produk
                    </div>
                    <div v-else-if="searchKeyword && filteredProducts.length === 0" class="px-6 py-3 text-sm text-gray-500 border-t">
                        Tidak ada produk yang cocok dengan pencarian
                    </div>
                </div>
            </div>
            
            <!-- Modal -->
            <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="flex justify-between items-center mb-4 pb-4 border-b">
                        <h3 class="text-xl font-bold text-gray-800">
                            {{ isEditing ? 'Edit Produk' : 'Tambah Produk' }}
                        </h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <form @submit.prevent="saveProduct" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kode Produk</label>
                                <input v-model="form.code" type="text" class="input-field" placeholder="Auto-generate">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                                <input v-model="form.name" type="text" required class="input-field" placeholder="Masukkan nama produk">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea v-model="form.description" rows="2" class="input-field" placeholder="Masukkan deskripsi produk"></textarea>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select v-model="form.category_id" class="select-field">
                                    <option value="">Pilih Kategori</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                <select v-model="form.supplier_id" class="select-field">
                                    <option value="">Pilih Supplier</option>
                                    <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                                        {{ sup.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                                <input v-model.number="form.price" type="number" step="1000" min="0" class="input-field" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                <input v-model.number="form.stock" type="number" min="0" class="input-field" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stok Minimum</label>
                                <input v-model.number="form.min_stock" type="number" min="0" class="input-field" placeholder="5">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select v-model="form.status" class="select-field">
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
                            </select>
                        </div>
                        
                        <!-- Modal Footer -->
                        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
                            <button type="button" @click="closeModal" class="btn-secondary">
                                Batal
                            </button>
                            <button type="submit" :disabled="submitting" class="btn-primary">
                                <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
                                {{ submitting ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};