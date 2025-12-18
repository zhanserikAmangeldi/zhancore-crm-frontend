<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-brand-indigo/5 text-xs uppercase text-brand-indigo font-semibold">
        <tr>
          <th class="px-6 py-4">Client Name</th>
          <th class="px-6 py-4">Initial Request</th>
          <th class="px-6 py-4">Creation Date</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-10 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="lead in crmStore.leads" :key="lead.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 font-medium text-brand-dark">
            {{ lead.clientName }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
            {{ lead.description }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500">
            {{ new Date(lead.createdAt).toLocaleDateString() }}
          </td>
          <td class="px-6 py-4">
            <StatusBadge :status="lead.status" />
          </td>
          <td class="px-6 py-4 text-right">
            <!-- Кнопка активна только если статус Assigned -->
            <router-link
              :to="`/consultant/leads/${lead.id}`"
              class="text-sm font-medium text-brand-teal hover:text-brand-dark bg-brand-teal/10 hover:bg-brand-teal/20 px-4 py-2 rounded-lg transition-all inline-flex"
            >
              {{ lead.status === 'New' ? 'Qualify' : 'Details' }}
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="crmStore.leads.length === 0" class="p-8 text-center text-gray-400">
        You have no any active leads
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import StatusBadge from '@/components/ui/StatusBadge.vue';

const crmStore = useCrmStore();

onMounted(() => {
  crmStore.fetchMyLeads();
});
</script>
