import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    const token = ref(localStorage.getItem('zhancore_token') || null);
    const userRole = ref(localStorage.getItem('zhancore_role') || null);

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => userRole.value === 'Admin');

    function login(payloadToken, payloadRole) {
        token.value = payloadToken;
        userRole.value = payloadRole;

        localStorage.setItem('zhancore_token', payloadToken);
        localStorage.setItem('zhancore_role', payloadRole);
    }

    function logout() {
        token.value = null;
        userRole.value = null;
        localStorage.removeItem('zhancore_token');
        localStorage.removeItem('zhancore_role');
        router.push('/login');
    }

    return { token, userRole, isAuthenticated, isAdmin, login, logout };
});