import { ref } from 'vue';

export const createState = () => {
  const consultants = ref([]);
  const leads = ref([]);
  const clients = ref([]);
  const opportunities = ref([]);
  const projects = ref([]);
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  return {
    consultants,
    leads,
    clients,
    opportunities,
    projects,
    users,
    isLoading,
    error
  };
};
