export default {
    data() {
        return {
            username: 'admin',
            password: 'admin123',
            error: '',
            loading: false
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = '';
            
            try {
                console.log('🔄 Login ke:', 'http://localhost:8080/api/auth/login');
                
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });
                
                const data = await response.json();
                console.log('📡 Response:', data);
                
                if (data.status) {
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    alert('✅ Login berhasil!');
                    window.location.href = '/#/dashboard';
                    window.location.reload();
                } else {
                    this.error = data.message || 'Login gagal';
                }
            } catch (error) {
                console.error('❌ Error:', error);
                this.error = 'Error: ' + error.message;
            } finally {
                this.loading = false;
            }
        }
    },
    template: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
            <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">E-Inventory</h2>
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Username</label>
                        <input v-model="username" type="text" 
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Password</label>
                        <input v-model="password" type="password" 
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
                    <button type="submit" :disabled="loading"
                            class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                        {{ loading ? 'Loading...' : 'Login' }}
                    </button>
                </form>
                <div class="mt-4 text-center text-sm text-gray-500">
                    Demo: admin / admin123
                </div>
            </div>
        </div>
    `
};