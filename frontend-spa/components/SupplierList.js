// ============================================================
// SUPPLIER LIST COMPONENT
// ============================================================

import axios from '../axios.js';

export default {
    data() {
        return {
            suppliers: [],
            loading: true,
            showModal: false,
            isEditing: false,
            form: {
                id: null,
                name: '',
                contact_person: '',
                phone: '',
                email: '',
                address: ''
            },
            submitting: false
        };
    },
    async mounted() {
        await this.loadSuppliers();
    },
    methods: {
        async loadSuppliers() {
            this.loading = true;
            try {
                const response = await axios.get('/supplier');
                this.suppliers = response.data.data || [];
            } catch (error) {
                console.error('Error loading suppliers:', error);
                alert('Gagal memuat data supplier');
            } finally {
                this.loading = false;
            }
        },
        openModal(supplier = null) {
            this.isEditing = !!supplier;
            this.form = supplier ? { ...supplier } : {
                id: null,
                name: '',
                contact_person: '',
                phone: '',
                email: '',
                address: ''
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.isEditing = false;
            this.form = {
                id: null,
                name: '',
                contact_person: '',
                phone: '',
                email: '',
                address: ''
            };
        },
        async saveSupplier() {
            if (!this.form.name) {
                alert('Nama supplier harus diisi!');
                return;
            }
            
            this.submitting = true;
            
            try {
                let response;
                if (this.isEditing) {
                    response = await axios.put(`/supplier/${this.form.id}`, this.form);
                } else {
                    response = await axios.post('/supplier', this.form);
                }
                
                if (response.data.status) {
                    alert(this.isEditing ? 'Supplier berhasil diupdate' : 'Supplier berhasil ditambahkan');
                    this.closeModal();
                    await this.loadSuppliers();
                } else {
                    alert(response.data.message || 'Gagal menyimpan supplier');
                }
            } catch (error) {
                console.error('Error saving supplier:', error);
                alert('Terjadi kesalahan saat menyimpan supplier');
            } finally {
                this.submitting = false;
            }
        },
        async deleteSupplier(id) {
            if (!confirm('Apakah Anda yakin ingin menghapus supplier ini?')) return;
            
            try {
                const response = await axios.delete(`/supplier/${id}`);
                if (response.data.status) {
                    alert('Supplier berhasil dihapus');
                    await this.loadSuppliers();
                } else {
                    alert(response.data.message || 'Gagal menghapus supplier');
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert('Terjadi kesalahan saat menghapus supplier');
            }
        }
    },
    template: `
        <div class="container mx-auto px-4 py-8">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Manajemen Supplier</h1>
                    <p class="text-gray-500 mt-1">Kelola data supplier / pemasok</p>
                </div>
                <button @click="openModal()" class="btn-primary whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>Tambah Supplier
                </button>
            </div>
            
            <!-- Table -->
            <div class="card overflow-hidden">
                <div v-if="loading" class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
                    <p class="text-gray-500 mt-3">Memuat data...</p>
                </div>
                
                <div v-else-if="suppliers.length === 0" class="text-center py-12">
                    <i class="fas fa-truck text-5xl text-gray-300 mb-4 block"></i>
                    <p class="text-gray-500">Belum ada supplier</p>
                    <button @click="openModal()" class="btn-primary mt-4">
                        <i class="fas fa-plus mr-2"></i>Tambah Supplier Pertama
                    </button>
                </div>
                
                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="table-header">Nama</th>
                                <th class="table-header">Kontak Person</th>
                                <th class="table-header">Telepon</th>
                                <th class="table-header">Email</th>
                                <th class="table-header text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="supplier in suppliers" :key="supplier.id" class="hover:bg-gray-50 transition-colors">
                                <td class="table-cell font-medium text-gray-900">{{ supplier.name }}</td>
                                <td class="table-cell text-gray-700">{{ supplier.contact_person || '-' }}</td>
                                <td class="table-cell text-gray-500">{{ supplier.phone || '-' }}</td>
                                <td class="table-cell text-gray-500">{{ supplier.email || '-' }}</td>
                                <td class="table-cell text-center">
                                    <div class="flex justify-center space-x-2">
                                        <button @click="openModal(supplier)" class="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button @click="deleteSupplier(supplier.id)" class="text-red-600 hover:text-red-800 transition-colors" title="Hapus">
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
                <div class="modal-content max-w-lg">
                    <div class="flex justify-between items-center mb-4 pb-4 border-b">
                        <h3 class="text-xl font-bold text-gray-800">
                            {{ isEditing ? 'Edit Supplier' : 'Tambah Supplier' }}
                        </h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form @submit.prevent="saveSupplier" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Supplier *</label>
                            <input v-model="form.name" type="text" required class="input-field" placeholder="Masukkan nama supplier">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kontak Person</label>
                            <input v-model="form.contact_person" type="text" class="input-field" placeholder="Masukkan nama kontak person">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                                <input v-model="form.phone" type="text" class="input-field" placeholder="Masukkan nomor telepon">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input v-model="form.email" type="email" class="input-field" placeholder="Masukkan alamat email">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <textarea v-model="form.address" rows="2" class="input-field" placeholder="Masukkan alamat supplier"></textarea>
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