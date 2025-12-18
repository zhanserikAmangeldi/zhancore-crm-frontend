import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCrmStore } from '@/stores/crm';
import { getLeads } from '@/api/crmService';

vi.mock('@/api/crmService', () => ({
  assignLeadOwner: vi.fn(),
  getClients: vi.fn(),
  getConsultants: vi.fn(),
  getLeads: vi.fn(),
  getLeadById: vi.fn(),
  getMyLeads: vi.fn(),
  getAllOpportunities: vi.fn(),
  getMyOpportunities: vi.fn(),
  getMyProjects: vi.fn(),
  getAllProjects: vi.fn(),
  getOpportunityById: vi.fn(),
  getProjectById: vi.fn(),
  getUsers: vi.fn(),
  createUser: vi.fn(),
  changeUserPassword: vi.fn(),
  deleteUser: vi.fn(),
  deleteClient: vi.fn(),
  deleteLead: vi.fn(),
  deleteOpportunity: vi.fn(),
  deleteProject: vi.fn(),
  qualifyLeadRequest: vi.fn(),
  qualifyOpportunityRequest: vi.fn(),
  updateLead: vi.fn(),
  updateOpportunity: vi.fn(),
  updateProject: vi.fn()
}));

describe('crm store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with empty state', () => {
    const store = useCrmStore();

    expect(store.leads).toEqual([]);
    expect(store.clients).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('fetchLeads populates leads list', async () => {
    const store = useCrmStore();
    getLeads.mockResolvedValue([
      { id: 'lead-1', name: 'Test Lead', description: 'Test', status: 'New' }
    ]);

    await store.fetchLeads();

    expect(store.leads.length).toBe(1);
    expect(store.leads[0].id).toBe('lead-1');
    expect(store.isLoading).toBe(false);
  });
});
