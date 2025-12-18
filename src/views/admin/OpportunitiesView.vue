<template>
  <div class="space-y-6">
    <AppSpinner v-if="crmStore.isLoading" label="Loading opportunities..." />

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
        <tr>
          <th class="px-6 py-4">Opportunity</th>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Budget</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Owner</th>
          <th class="px-9 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="opp in crmStore.opportunities" :key="opp.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ opp.name || 'Без названия' }}</div>
            <div class="text-xs text-gray-400">ID: {{ opp.id.slice(0, 8) }}...</div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ opp.clientName || 'Неизвестно' }}
          </td>
          <td class="px-6 py-4 text-gray-800 font-medium">
            {{ opp.price ? opp.price.toLocaleString() + ' ₸' : '-' }}
          </td>
          <td class="px-6 py-4">
            <StatusBadge :status="opp.status" />
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ opp.ownerName || 'Not Assigned' }}
          </td>
          <td class="px-6 py-4 text-right">
            <button
              @click="handleDeleteOpportunity(opp.id)"
              class="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="crmStore.opportunities.length === 0" class="p-8 text-center text-gray-400">
        There are no opportunities
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppSpinner from '@/components/ui/AppSpinner.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import { useConfirmAction } from '@/composables/useConfirmAction';

const crmStore = useCrmStore();
const { run: confirmAction } = useConfirmAction();

onMounted(() => {
  crmStore.fetchAllOpportunities();
});

const handleDeleteOpportunity = async (opportunityId) => {
  await confirmAction({
    message: 'Are you sure you want to delete this opportunity?',
    action: () => crmStore.deleteOpportunity(opportunityId),
    onError: () => alert('Failed to delete opportunity')
  });
};
</script>
