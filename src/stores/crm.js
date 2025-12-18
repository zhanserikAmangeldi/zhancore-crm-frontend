import { defineStore } from 'pinia';
import { createState } from '@/stores/crm/state';
import { createActions } from '@/stores/crm/actions';

export const useCrmStore = defineStore('crm', () => {
  const state = createState();
  const actions = createActions(state);

  return {
    ...state,
    ...actions
  };
});
