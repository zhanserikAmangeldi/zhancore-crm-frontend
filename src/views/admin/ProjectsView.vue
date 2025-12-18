<template>
  <div class="space-y-6">
    <AppSpinner v-if="crmStore.isLoading" label="Loading projects..." />

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
        <tr>
          <th class="px-6 py-4">Project</th>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Deadline</th>
          <th class="px-6 py-4">Budget</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Owner</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="project in crmStore.projects" :key="project.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ project.name || 'Без названия' }}</div>
            <div class="text-xs text-gray-400">ID: {{ project.id.slice(0, 8) }}...</div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ project.clientName || 'Неизвестно' }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ project.endDate ? new Date(project.endDate).toLocaleDateString() : '-' }}
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
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ project.ownerName || 'Not Assigned' }}
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="crmStore.projects.length === 0" class="p-8 text-center text-gray-400">
        There are no projects
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
  crmStore.fetchAllProjects();
});

const getStatusColor = (status) => {
  switch (status) {
    case 'Planning': return 'bg-purple-100 text-purple-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>
