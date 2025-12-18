<template>
  <div class="space-y-6">
    <div class="flex justify-end items-center">
      <!-- Search -->
      <div class="relative w-64">
        <input
            type="text"
            placeholder="Search client..."
            class="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-teal/20 outline-none"
        >
        <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
    </div>

    <AppSpinner v-if="crmStore.isLoading" label="Loading clients..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
        <tr>
          <th class="px-6 py-4">ID</th>
          <th class="px-6 py-4">Name / Company</th>
          <th class="px-6 py-4">Contacts</th>
          <th class="px-9 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="client in crmStore.clients" :key="client.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 text-xs text-gray-400 font-mono">
            {{ client.id }}
          </td>
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ client.name }}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-700 flex flex-col">
              <span v-if="client.details !== ''">{{ client.details }}</span>
              <span v-else class="text-gray-400">Нет контактов</span>
            </div>
          </td>
          <td class="px-6 py-4 text-right">
            <button
              @click="handleDeleteClient(client.id)"
              class="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="crmStore.clients.length === 0" class="p-8 text-center text-gray-400">
        There are no clients
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppSpinner from '@/components/ui/AppSpinner.vue';

export default {
  components: {
    AppSpinner
  },
  setup() {
    const crmStore = useCrmStore();
    const hasClearedError = ref(false);

    onMounted(() => {
      crmStore.fetchClients();
    });

    onUpdated(() => {
      if (!hasClearedError.value && crmStore.clients.length > 0 && crmStore.error) {
        crmStore.error = null;
        hasClearedError.value = true;
      }
    });

    onUnmounted(() => {
      crmStore.error = null;
    });

    const handleDeleteClient = async (clientId) => {
      if (!confirm('Are you sure you want to delete this client?')) return;
      try {
        await crmStore.deleteClient(clientId);
      } catch (e) {
        alert('Failed to delete client');
      }
    };

    return {
      crmStore,
      handleDeleteClient
    };
  }
};
</script>
