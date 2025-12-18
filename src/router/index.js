import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const MainLayout = () => import('@/layouts/MainLayout.vue');

const LoginView = () => import('@/views/LoginView.vue');
const AdminLeadsView = () => import('@/views/admin/LeadsView.vue');
const AdminClientsView = () => import('@/views/admin/ClientsView.vue');
const AdminUsersView = () => import('@/views/admin/UsersView.vue');
const AdminOpportunitiesView = () => import('@/views/admin/OpportunitiesView.vue');
const AdminProjectsView = () => import('@/views/admin/ProjectsView.vue');
const ConsultantMyLeads = () => import('@/views/consultant/MyLeads.vue');
const ConsultantOpportunities = () => import('@/views/consultant/MyOpportunities.vue');
const ConsultantProjects = () => import('@/views/consultant/MyProjects.vue');
const ConsultantLeadForm = () => import('@/views/consultant/LeadForm.vue');
const ConsultantOpportunityForm = () => import('@/views/consultant/OpportunityForm.vue');
const ConsultantProjectForm = () => import('@/views/consultant/ProjectForm.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

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
                { path: 'opportunities', name: 'admin-opportunities', component: AdminOpportunitiesView },
                { path: 'projects', name: 'admin-projects', component: AdminProjectsView },
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
                { path: 'leads/:id', name: 'consultant-lead-form', component: ConsultantLeadForm },
                { path: 'opportunities', name: 'consultant-opportunities', component: ConsultantOpportunities },
                { path: 'opportunities/:id', name: 'consultant-opportunity-form', component: ConsultantOpportunityForm },
                { path: 'projects', name: 'consultant-projects', component: ConsultantProjects },
                { path: 'projects/:id', name: 'consultant-project-form', component: ConsultantProjectForm },
            ]
        },
        { path: '/', redirect: '/login' },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
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
