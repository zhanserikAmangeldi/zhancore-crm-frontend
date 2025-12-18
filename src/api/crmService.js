import api from '@/api';

export const getLeads = async () => {
  const { data } = await api.get('/api/lead/all');
  return data;
};

export const getConsultants = async () => {
  const { data } = await api.get('/api/admin/users');
  return data;
};

export const getClients = async () => {
  const { data } = await api.get('/api/client/all');
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get('/api/admin/users');
  return data;
};

export const assignLeadOwner = async (payload) => {
  await api.post('/api/lead/assign-owner', payload);
};

export const getMyLeads = async () => {
  const { data } = await api.get('/api/lead/my-leads');
  return data;
};

export const updateLead = async (payload) => {
  await api.put('/api/lead/update', payload);
};

export const qualifyLeadRequest = async (leadId) => {
  await api.post(`/api/lead/qualify/${leadId}`);
};

export const getMyOpportunities = async () => {
  const { data } = await api.get('/api/opportunity/my-opportunities');
  return data;
};

export const updateOpportunity = async (payload) => {
  await api.put('/api/opportunity/update', payload);
};

export const qualifyOpportunityRequest = async (payload) => {
  await api.post('/api/opportunity/qualify-to-project', payload);
};

export const getMyProjects = async () => {
  const { data } = await api.get('/api/project/my-projects');
  return data;
};
