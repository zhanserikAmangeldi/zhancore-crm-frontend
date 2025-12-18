<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
    </div>

    <!-- Таблица -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-brand-teal/5 text-xs uppercase text-brand-teal font-semibold">
        <tr>
          <th class="px-6 py-4">Project Name</th>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Deadline</th>
          <th class="px-6 py-4">Budget</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4 text-right">Info</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="project in crmStore.projects" :key="project.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ project.name }}</div>
            <div class="text-xs text-gray-400">Created: {{ new Date(project.createdAt).toLocaleDateString() }}</div>
          </td>
          <td class="px-6 py-4 text-gray-700">
            {{ project.clientName }}
          </td>
          <td class="px-6 py-4 text-sm">
              <span class="text-brand-indigo font-medium">
                {{ new Date(project.endDate).toLocaleDateString() }}
              </span>
          </td>
          <td class="px-6 py-4 font-bold text-gray-800">
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
            <button
                @click="openDetails(project)"
                class="text-gray-400 hover:text-brand-teal transition-colors"
                title="View Details"
            >
              Details
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="crmStore.projects.length === 0" class="p-8 text-center text-gray-400">
        You have no any active projects
      </div>
    </div>

    <AppModal
        :is-open="isDetailsOpen"
        :title="selectedProject?.name || 'Project Details'"
        @close="isDetailsOpen = false"
    >
      <div v-if="selectedProject" class="flex flex-col gap-5">

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <p class="text-xs text-gray-500 uppercase">Client</p>
            <p class="font-semibold text-brand-dark">{{ selectedProject.clientName }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Manager</p>
            <p class="font-semibold text-brand-dark">{{ selectedProject.ownerName }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Budget</p>
            <p class="font-semibold text-brand-teal">{{ selectedProject.totalPrice?.toLocaleString() }} ₸</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase">Support included?</p>
            <p class="font-medium" :class="selectedProject.isSupportIncluded ? 'text-green-600' : 'text-gray-600'">
              {{ selectedProject.isSupportIncluded ? 'Yes' : 'No' }}
            </p>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-brand-indigo mb-2">Work Description</h4>
          <div class="bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
            {{ selectedProject.description }}
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-brand-indigo mb-2">Estimated deadline</h4>
          <div class="flex items-center gap-2 text-sm">
            <span class="bg-brand-teal/10 px-3 py-1 rounded text-brand-teal font-medium">End: {{ new Date(selectedProject.endDate).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-100">
          <button @click="isDetailsOpen = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppModal from '@/components/ui/AppModal.vue';

const crmStore = useCrmStore();
const isDetailsOpen = ref(false);
const selectedProject = ref(null);

onMounted(() => {
  crmStore.fetchMyProjects();
});

const openDetails = (project) => {
  selectedProject.value = project;
  isDetailsOpen.value = true;
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Planning': return 'bg-purple-100 text-purple-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>