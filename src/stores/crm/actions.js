import {
  assignLeadOwner,
  getClients,
  getConsultants,
  getLeads,
  getLeadById,
  getMyLeads,
  getAllOpportunities,
  getMyOpportunities,
  getMyProjects,
  getAllProjects,
  getOpportunityById,
  getProjectById,
  getUsers,
  createUser as createUserRequest,
  changeUserPassword as changeUserPasswordRequest,
  deleteUser as deleteUserRequest,
  deleteClient as deleteClientRequest,
  deleteLead as deleteLeadRequest,
  deleteOpportunity as deleteOpportunityRequest,
  deleteProject as deleteProjectRequest,
  qualifyLeadRequest,
  qualifyOpportunityRequest,
  updateLead,
  updateOpportunity,
  updateProject
} from '@/api/crmService';

export const createActions = (state) => {
  const {
    consultants,
    leads,
    clients,
    opportunities,
    projects,
    users,
    isLoading,
    error
  } = state;

  const fetchLeads = async () => {
    isLoading.value = true;
    try {
      leads.value = await getLeads();
    } catch (err) {
      error.value = 'Failed to load leads';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchConsultants = async () => {
    try {
      consultants.value = await getConsultants();
    } catch (err) {
      console.error('Failed to load consultants', err);
    }
  };

  const fetchClients = async () => {
    try {
      clients.value = await getClients();
    } catch (err) {
      console.error('Failed to load consultants', err);
    }
  };

  const fetchUsers = async () => {
    try {
      users.value = await getUsers();
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const createUser = async (payload) => {
    isLoading.value = true;
    try {
      const created = await createUserRequest(payload);
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
  };

  const deleteUser = async (userId) => {
    isLoading.value = true;
    try {
      await deleteUserRequest(userId);
      users.value = users.value.filter(user => user.id !== userId);
      return true;
    } catch (err) {
      error.value = 'Failed to delete user';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const changeUserPassword = async (payload) => {
    isLoading.value = true;
    try {
      await changeUserPasswordRequest(payload);
      return true;
    } catch (err) {
      error.value = 'Failed to change user password';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteClient = async (clientId) => {
    isLoading.value = true;
    try {
      await deleteClientRequest(clientId);
      clients.value = clients.value.filter(client => client.id !== clientId);
      return true;
    } catch (err) {
      error.value = 'Failed to delete client';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const assignLead = async (payload) => {
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
  };

  const fetchMyLeads = async () => {
    isLoading.value = true;
    try {
      leads.value = await getMyLeads();
    } catch (err) {
      error.value = 'Failed to load your leads';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchLeadById = async (leadId) => {
    try {
      return await getLeadById(leadId);
    } catch (err) {
      error.value = 'Failed to load lead details';
      throw err;
    }
  };

  const addLeadDetails = async (payload) => {
    isLoading.value = true;
    try {
      await updateLead(payload);
      return true;
    } catch (err) {
      error.value = 'Failed to save lead details';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const qualifyLead = async (leadId) => {
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
  };

  const deleteLead = async (leadId) => {
    isLoading.value = true;
    try {
      await deleteLeadRequest(leadId);
      leads.value = leads.value.filter(lead => lead.id !== leadId);
      return true;
    } catch (err) {
      error.value = 'Failed to delete lead';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMyOpportunities = async () => {
    isLoading.value = true;
    try {
      opportunities.value = await getMyOpportunities();
    } catch (err) {
      error.value = 'Failed to load your opportunities';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllOpportunities = async () => {
    isLoading.value = true;
    try {
      opportunities.value = await getAllOpportunities();
    } catch (err) {
      error.value = 'Failed to load opportunities';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchOpportunityById = async (opportunityId) => {
    try {
      return await getOpportunityById(opportunityId);
    } catch (err) {
      error.value = 'Failed to load opportunity details';
      throw err;
    }
  };

  const addOpportunityDetails = async (payload) => {
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
  };

  const qualifyOpportunity = async (payload) => {
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
  };

  const deleteOpportunity = async (opportunityId) => {
    isLoading.value = true;
    try {
      await deleteOpportunityRequest(opportunityId);
      opportunities.value = opportunities.value.filter(opportunity => opportunity.id !== opportunityId);
      return true;
    } catch (err) {
      error.value = 'Failed to delete opportunity';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMyProjects = async () => {
    isLoading.value = true;
    try {
      projects.value = await getMyProjects();
    } catch (err) {
      error.value = 'Failed to load your projects';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllProjects = async () => {
    isLoading.value = true;
    try {
      projects.value = await getAllProjects();
    } catch (err) {
      error.value = 'Failed to load projects';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProjectById = async (projectId) => {
    try {
      return await getProjectById(projectId);
    } catch (err) {
      error.value = 'Failed to load project details';
      throw err;
    }
  };

  const updateProjectDetails = async (payload) => {
    isLoading.value = true;
    try {
      await updateProject(payload);
      const project = projects.value.find(p => p.id === payload.projectId);
      if (project) {
        Object.assign(project, payload);
      }
      return true;
    } catch (err) {
      error.value = 'Failed to save project details';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProject = async (projectId) => {
    isLoading.value = true;
    try {
      await deleteProjectRequest(projectId);
      projects.value = projects.value.filter(project => project.id !== projectId);
      return true;
    } catch (err) {
      error.value = 'Failed to delete project';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    fetchLeads,
    fetchConsultants,
    fetchClients,
    fetchUsers,
    createUser,
    deleteUser,
    changeUserPassword,
    deleteClient,
    assignLead,
    fetchMyLeads,
    fetchLeadById,
    addLeadDetails,
    qualifyLead,
    deleteLead,
    fetchMyOpportunities,
    fetchAllOpportunities,
    fetchOpportunityById,
    addOpportunityDetails,
    qualifyOpportunity,
    deleteOpportunity,
    fetchMyProjects,
    fetchAllProjects,
    fetchProjectById,
    updateProjectDetails,
    deleteProject
  };
};
