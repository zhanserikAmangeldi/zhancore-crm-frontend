<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
    </div>

    <AppSpinner v-if="crmStore.isLoading" label="Loading opportunities..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-brand-indigo/5 text-xs uppercase text-brand-indigo font-semibold">
        <tr>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Budget</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-10 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="opp in crmStore.opportunities" :key="opp.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ opp.name || 'Без названия' }}</div>
          </td>
          <td class="px-6 py-4 text-gray-600">
            {{ opp.clientName || 'Неизвестно' }}
          </td>
          <td class="px-6 py-4 text-gray-800 font-medium">
            {{ opp.price ? opp.price.toLocaleString() + ' ₸' : '-' }}
          </td>
          <td class="px-6 py-4">
            <StatusBadge :status="opp.status" />
          </td>
          <td class="px-6 py-4 text-right">
            <router-link
              :to="`/consultant/opportunities/${opp.id}`"
              class="text-sm font-medium text-brand-teal hover:text-brand-dark bg-brand-teal/10 hover:bg-brand-teal/20 px-4 py-2 rounded-lg transition-all inline-flex"
            >
              {{ opp.status === 'New' ? 'To Project (Qualify)' : 'Details' }}
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="crmStore.opportunities.length === 0" class="p-8 text-center text-gray-400">
        No opportunities found. First qualify leads.
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import AppSpinner from '@/components/ui/AppSpinner.vue';

const crmStore = useCrmStore();

onMounted(() => {
  crmStore.fetchMyOpportunities();
});
</script>
