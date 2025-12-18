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

export const assignLeadOwner = async (payload) => {
  await api.post('/lead/assign-owner', payload);
};

export const getMyLeads = async () => {
  const { data } = await api.get('/lead/my-leads');
  return data;
};

export const updateLead = async (payload) => {
  await api.put('/lead/update', payload);
};

export const qualifyLeadRequest = async (leadId) => {
  await api.post(`/lead/qualify/${leadId}`);
};

export const getMyOpportunities = async () => {
  const { data } = await api.get('/opportunity/my-opportunities');
  return data;
};

export const updateOpportunity = async (payload) => {
  await api.put('/opportunity/update', payload);
};

export const qualifyOpportunityRequest = async (payload) => {
  await api.post('/opportunity/qualify-to-project', payload);
};

export const getMyProjects = async () => {
  const { data } = await api.get('/project/my-projects');
  return data;
};
