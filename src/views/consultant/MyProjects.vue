<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
    </div>

    <AppSpinner v-if="crmStore.isLoading" label="Loading projects..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-brand-indigo/5 text-xs uppercase text-brand-indigo font-semibold">
        <tr>
          <th class="px-6 py-4">Project Name</th>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Deadline</th>
          <th class="px-6 py-4">Budget</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-10 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="project in crmStore.projects" :key="project.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ project.name }}</div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ project.clientName }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500">
              <span class="text-brand-indigo font-medium">
                {{ new Date(project.endDate).toLocaleDateString() }}
              </span>
          </td>
          <td class="px-6 py-4 text-gray-800 font-medium">
            {{ project.totalPrice ? project.totalPrice.toLocaleString() + ' ₸' : '-' }}
          </td>
          <td class="px-6 py-4">
            <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusColor(project.status)"
            >
                {{ project.status }}
              </span>
          </td>
          <td class="px-6 py-4 text-right">
            <router-link
              :to="`/consultant/projects/${project.id}`"
              class="text-sm font-medium text-brand-teal hover:text-brand-dark bg-brand-teal/10 hover:bg-brand-teal/20 px-4 py-2 rounded-lg transition-all inline-flex"
              title="View Details"
            >
              Details
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="crmStore.projects.length === 0" class="p-8 text-center text-gray-400">
        You have no any active projects
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppSpinner from '@/components/ui/AppSpinner.vue';

const crmStore = useCrmStore();

onMounted(() => {
  crmStore.fetchMyProjects();
});

const getStatusColor = (status) => {
  switch(status) {
    case 'Planning': return 'bg-purple-100 text-purple-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>
