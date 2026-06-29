// ============================================================
// CATEGORY LIST COMPONENT
// ============================================================

import axios from '../axios.js';

export default {
    data() {
        return {
            categories: [],
            loading: true,
            showModal: false,
            isEditing: false,
            form: {
                id: null,
                name: '',
                description: ''
            },
            submitting: false
        };
    },
    async mounted() {
        await this.loadCategories();
    },
    methods: {
        async loadCategories() {
            this.loading = true;
            try {
                const response = await axios.get('/category');
                this.categories = response.data.data || [];
            } catch (error) {
                console.error('Error loading categories:', error);
                alert('Gagal memuat data kategori');
            } finally {
                this.loading = false;
            }
        },
        openModal(category = null) {
            this.isEditing = !!category;
            this.form = category ? { ...category } : {
                id: null,
                name: '',
                description: ''
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.isEditing = false;
            this.form = { id: null, name: '', description: '' };
        },
        async saveCategory() {
            if (!this.form.name) {
                alert('Nama kategori harus diisi!');
                return;
            }
            
            this.submitting = true;
            
            try {
                let response;
                if (this.isEditing) {
                    response = await axios.put(`/category/${this.form.id}`, this.form);
                } else {
                    response = await axios.post('/category', this.form);
                }
                
                if (response.data.status) {
                    alert(this.isEditing ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan');
                    this.closeModal();
                    await this.loadCategories();
                } else {
                    alert(response.data.message || 'Gagal menyimpan kategori');
                }
            } catch (error) {
                console.error('Error saving category:', error);
                alert('Terjadi kesalahan saat menyimpan kategori');
            } finally {
                this.submitting = false;
            }
        },
        async deleteCategory(id) {
            if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
            
            try {
                const response = await axios.delete(`/category/${id}`);
                if (response.data.status) {
                    alert('Kategori berhasil dihapus');
                    await this.loadCategories();
                } else {
                    alert(response.data.message || 'Gagal menghapus kategori');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Terjadi kesalahan saat menghapus kategori');
            }
        }
    },
    template: `
        <div class="container mx-auto px-4 py-8">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Manajemen Kategori</h1>
                    <p class="text-gray-500 mt-1">Kelola kategori produk</p>
                </div>
                <button @click="openModal()" class="btn-primary whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>Tambah Kategori
                </button>
            </div>
            
            <!-- Table -->
            <div class="card overflow-hidden">
                <div v-if="loading" class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
                    <p class="text-gray-500 mt-3">Memuat data...</p>
                </div>
                
                <div v-else-if="categories.length === 0" class="text-center py-12">
                    <i class="fas fa-tags text-5xl text-gray-300 mb-4 block"></i>
                    <p class="text-gray-500">Belum ada kategori</p>
                    <button @click="openModal()" class="btn-primary mt-4">
                        <i class="fas fa-plus mr-2"></i>Tambah Kategori Pertama
                    </button>
                </div>
                
                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="table-header">ID</th>
                                <th class="table-header">Nama</th>
                                <th class="table-header">Deskripsi</th>
                                <th class="table-header text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition-colors">
                                <td class="table-cell text-gray-500">#{{ category.id }}</td>
                                <td class="table-cell font-medium text-gray-900">{{ category.name }}</td>
                                <td class="table-cell text-gray-500">{{ category.description || '-' }}</td>
                                <td class="table-cell text-center">
                                    <div class="flex justify-center space-x-2">
                                        <button @click="openModal(category)" class="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-800 transition-colors" title="Hapus">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal -->
            <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content max-w-md">
                    <div class="flex justify-between items-center mb-4 pb-4 border-b">
                        <h3 class="text-xl font-bold text-gray-800">
                            {{ isEditing ? 'Edit Kategori' : 'Tambah Kategori' }}
                        </h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form @submit.prevent="saveCategory" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                            <input v-model="form.name" type="text" required class="input-field" placeholder="Masukkan nama kategori">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea v-model="form.description" rows="3" class="input-field" placeholder="Masukkan deskripsi kategori"></textarea>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4 border-t">
                            <button type="button" @click="closeModal" class="btn-secondary">Batal</button>
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