import api from '@/api';

export const getLeads = async () => {
  const { data } = await api.get('/lead/all');
  return data;
};

export const getConsultants = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const getClients = async () => {
  const { data } = await api.get('/client/all');
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const createUser = async (payload) => {
  const { data } = await api.post('/admin/users/create', payload);
  return data;
};

export const changeUserPassword = async (payload) => {
  const { data } = await api.post('/admin/users/change-password', payload);
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
};

export const deleteClient = async (clientId) => {
  await api.delete('/client/delete', { data: { id: clientId } });
};

export const assignLeadOwner = async (payload) => {
  await api.post('/lead/assign-owner', payload);
};

export const getMyLeads = async () => {
  const { data } = await api.get('/lead/my-leads');
  return data;
};

export const getLeadById = async (leadId) => {
  const { data } = await api.get(`/lead/${leadId}`);
  return data;
};

export const updateLead = async (payload) => {
  await api.put('/lead/update', payload);
};

export const qualifyLeadRequest = async (leadId) => {
  await api.post(`/lead/qualify/${leadId}`);
};

export const deleteLead = async (leadId) => {
  await api.delete('/lead/delete', { data: { id: leadId } });
};

export const getMyOpportunities = async () => {
  const { data } = await api.get('/opportunity/my-opportunities');
  return data;
};

export const getAllOpportunities = async () => {
  const { data } = await api.get('/opportunity/all');
  return data;
};

export const getOpportunityById = async (opportunityId) => {
  const { data } = await api.get(`/opportunity/${opportunityId}`);
  return data;
};

export const updateOpportunity = async (payload) => {
  await api.put('/opportunity/update', payload);
};

export const qualifyOpportunityRequest = async (payload) => {
  await api.post('/opportunity/qualify-to-project', payload);
};

export const deleteOpportunity = async (opportunityId) => {
  await api.delete('/opportunity/delete', { data: { id: opportunityId } });
};

export const getMyProjects = async () => {
  const { data } = await api.get('/project/my-projects');
  return data;
};

export const getAllProjects = async () => {
  const { data } = await api.get('/project/all');
  return data;
};

export const getProjectById = async (projectId) => {
  const { data } = await api.get(`/project/${projectId}`);
  return data;
};

export const updateProject = async (payload) => {
  await api.put('/project/update', payload);
};

export const deleteProject = async (projectId) => {
  await api.delete('/project/delete', { data: { id: projectId } });
};
