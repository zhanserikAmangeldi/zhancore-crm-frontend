import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';

export const useCrmStore = defineStore('crm', () => {
    const consultants = ref([]);
    const leads = ref([]);
    const clients = ref([]);
    const opportunities = ref([]);
    const projects = ref([]);
    const users = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchLeads() {
        isLoading.value = true;
        try {
            const { data } = await api.get('/api/lead/all');
            leads.value = data;
        } catch (err) {
            error.value = 'Failed to load leads';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchConsultants() {
        try {
            const { data } = await api.get('/api/admin/users');
            console.log(data);
            consultants.value = data;
        } catch (err) {
            console.error('Failed to load consultants', err);
        }
    }

    async function fetchClients() {
        try {
            const { data } = await api.get('/api/client/all');
            console.log(data);
            clients.value = data;
        } catch (err) {
            console.error('Failed to load consultants', err);
        }
    }

    async function fetchUsers() {
        try {
            const { data } = await api.get('/api/admin/users');
            console.log(data);
            users.value = data;
        } catch (err) {
            console.error('Failed to load users', err);
        }
    }

    async function assignLead(payload) {
        isLoading.value = true;
        try {
            await api.post('/api/lead/assign-owner', payload);

            const lead = leads.value.find(l => l.id === payload.entityId);
            if (lead) {
                lead.ownerId = payload.newOwnerId;
                lead.status = 'Assigned';
            }

            return true;
        } catch (err) {
            error.value = 'Failed to assign to lead consultants';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchMyLeads() {
        isLoading.value = true;
        try {
            const { data } = await api.get('/api/lead/my-leads');
            leads.value = data;
        } catch (err) {
            error.value = 'Failed to load your leads';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    async function addLeadDetails(payload) {
        isLoading.value = true;
        try {
            await api.put('/api/lead/update', payload);

            const lead = leads.value.find(l => l.id === payload.leadId);

            return true;
        } catch (err) {
            error.value = 'Failed to save lead details';
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function qualifyLead(leadId) {
        isLoading.value = true;
        try {
            await api.post(`/api/lead/qualify/${leadId}`);

            const lead = leads.value.find(l => l.id === leadId);
            if (lead) {
                lead.status = 'Qualified';
            }

            return true;
        } catch (err) {
            error.value = 'Failed to qualify lead details';
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchMyOpportunities() {
        isLoading.value = true;
        try {
            const { data } = await api.get('/api/opportunity/my-opportunities');
            opportunities.value = data;
        } catch (err) {
            error.value = 'Failed to load your opportunities';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    async function addOpportunityDetails(payload) {
        isLoading.value = true;
        try {
            await api.put('/api/opportunity/update', payload);

            return true;
        } catch (err) {
            error.value = 'Failed to save opportunity details';
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function qualifyOpportunity(payload) {
        isLoading.value = true;
        try {
            await api.post('/api/opportunity/qualify-to-project', payload);

            const oppIndex = opportunities.value.findIndex(o => o.id === payload.opportunityId);
            if (oppIndex !== -1) {
                opportunities.value[oppIndex].status = 'ClosedWon';
            }

            return true;
        } catch (err) {
            error.value = 'Failed to qualify opportunity details';
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchMyProjects() {
        isLoading.value = true;
        try {
            const { data } = await api.get('/api/project/my-projects');
            projects.value = data;
        } catch (err) {
            error.value = 'Failed to load your projects';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        consultants,
        leads,
        opportunities,
        projects,
        clients,
        users,
        isLoading,
        error,
        fetchLeads,
        fetchConsultants,
        fetchClients,
        fetchUsers,
        assignLead,
        fetchMyLeads,
        addLeadDetails,
        qualifyLead,
        fetchMyOpportunities,
        addOpportunityDetails,
        qualifyOpportunity,
        fetchMyProjects
    };
});