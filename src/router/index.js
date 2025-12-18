import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import MainLayout from '@/layouts/MainLayout.vue';

import LoginView from '@/views/LoginView.vue';
import AdminLeadsView from '@/views/admin/LeadsView.vue';
import AdminClientsView from '@/views/admin/ClientsView.vue';
import AdminUsersView from '@/views/admin/UsersView.vue';
import ConsultantMyLeads from '@/views/consultant/MyLeads.vue';
import ConsultantOpportunities from '@/views/consultant/MyOpportunities.vue';
import ConsultantProjects from '@/views/consultant/MyProjects.vue';

const Placeholder = { template: '<div class="text-gray-400">Page in development...</div>' };

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/admin',
            component: MainLayout,
            meta: { requiresAuth: true, role: 'Admin' },
            children: [
                { path: '', redirect: '/admin/leads' },
                { path: 'leads', name: 'admin-leads', component: AdminLeadsView },
                { path: 'clients', name: 'admin-clients', component: AdminClientsView },
                { path: 'users', name: 'admin-users', component: AdminUsersView },
            ]
        },
        {
            path: '/consultant',
            component: MainLayout,
            meta: { requiresAuth: true, role: 'Consultant' },
            children: [
                { path: '', redirect: '/consultant/leads' },
                { path: 'leads', name: 'consultant-leads', component: ConsultantMyLeads },
                { path: 'opportunities', name: 'consultant-opportunities', component: ConsultantOpportunities },
                { path: 'projects', name: 'consultant-projects', component: ConsultantProjects },
            ]
        },
        { path: '/', redirect: '/login' }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) next('/login');
    else if (to.meta.role && authStore.userRole !== to.meta.role) {
        next(authStore.userRole === 'Admin' ? '/admin' : '/consultant');
    } else next();
});

export default router;