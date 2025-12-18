import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    assignLeadOwner,
    getClients,
    getConsultants,
    getLeads,
    getMyLeads,
    getMyOpportunities,
    getMyProjects,
    getUsers,
    createUser as createUserRequest,
    qualifyLeadRequest,
    qualifyOpportunityRequest,
    updateLead,
    updateOpportunity
} from '@/api/crmService';

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
            leads.value = await getLeads();
        } catch (err) {
            error.value = 'Failed to load leads';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchConsultants() {
        try {
            consultants.value = await getConsultants();
        } catch (err) {
            console.error('Failed to load consultants', err);
        }
    }

    async function fetchClients() {
        try {
            clients.value = await getClients();
        } catch (err) {
            console.error('Failed to load consultants', err);
        }
    }

    async function fetchUsers() {
        try {
            users.value = await getUsers();
        } catch (err) {
            console.error('Failed to load users', err);
        }
    }

    async function createUser(payload) {
        isLoading.value = true;
        try {
            const created = await createUserRequest(payload);
            // If API returns the created user object, append it locally; otherwise refetch
            if (created && created.id) {
                users.value.push(created);
            } else {
                await fetchUsers();
            }
            return created;
        } catch (err) {
            error.value = 'Failed to create user';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function assignLead(payload) {
        isLoading.value = true;
        try {
            await assignLeadOwner(payload);

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
            leads.value = await getMyLeads();
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
            await updateLead(payload);

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
            await qualifyLeadRequest(leadId);

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
            opportunities.value = await getMyOpportunities();
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
            await updateOpportunity(payload);

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
            await qualifyOpportunityRequest(payload);

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
            projects.value = await getMyProjects();
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
        createUser,
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
