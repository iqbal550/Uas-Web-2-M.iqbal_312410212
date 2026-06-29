import router from './router.js';
import Navbar from './components/Navbar.js';

export default {
    components: {
        Navbar
    },
    setup() {
        const isLoggedIn = Vue.ref(localStorage.getItem('isLoggedIn') === 'true');
        const user = Vue.ref(JSON.parse(localStorage.getItem('user') || 'null'));
        
        return {
            isLoggedIn,
            user
        };
    },
    template: `
        <div>
            <Navbar v-if="isLoggedIn" :user="user" />
            <router-view />
        </div>
    `
};