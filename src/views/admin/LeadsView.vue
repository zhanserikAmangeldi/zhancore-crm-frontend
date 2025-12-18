<template>
  <div class="space-y-6">
    <div class="flex justify-end items-center">
      <div class="relative">
        <input
            type="text"
            placeholder="Search lead..."
            class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-teal/20 outline-none w-64"
        >
        <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
    </div>

    <AppSpinner v-if="crmStore.isLoading" label="Loading leads..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
        <tr>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Details / Message</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Responsible</th>
          <th class="px-9 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="lead in crmStore.leads" :key="lead.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ lead.name }}</div>
            <div class="text-xs text-gray-400">ID: {{ lead.id.slice(0, 8) }}...</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-600">{{ lead.description }}</div>
          </td>
          <td class="px-6 py-4">
            <StatusBadge :status="lead.status" />
          </td>
          <td class="px-6 py-4 text-sm">
            <div v-if="lead.ownerName !== 'Not Assigned'" class="flex items-center gap-2 text-brand-indigo font-medium">
              👤 {{lead.ownerName}}
            </div>
            <span v-else class="text-gray-400">Не назначен</span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                  v-if="lead.ownerName === 'Not Assigned'"
                  @click="openAssignModal(lead)"
                  class="text-sm text-white bg-brand-teal hover:bg-brand-teal/90 px-3 py-1.5 rounded-md transition-colors"
              >
                Assign
              </button>
              <button
                  @click="handleDeleteLead(lead.id)"
                  class="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Window -->
    <AppModal
        :is-open="isAssignModalOpen"
        title="Assign Consultant"
        @close="isAssignModalOpen = false"
    >
      <div v-if="selectedLead" class="flex flex-col gap-4">
        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p class="text-sm text-gray-500">{{selectedLead.clientName}}</p>
          <p class="font-semibold text-brand-dark">{{ selectedLead.description }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Choose Consultant:</label>
          <select
              v-model="selectedConsultantId"
              class="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-brand-teal"
          >
            <option :value="null" disabled>List of Consultants</option>
            <option
                v-for="consultant in crmStore.consultants.filter(c => c.role !== 'Admin')"
                :key="consultant.id"
                :value="consultant.id"
            >
              {{ consultant.username }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button @click="isAssignModalOpen = false" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Отмена</button>
          <button
              @click="confirmAssign"
              :disabled="!selectedConsultantId"
              class="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 disabled:opacity-50"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppModal from '@/components/ui/AppModal.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import AppSpinner from '@/components/ui/AppSpinner.vue';
import { useConfirmAction } from '@/composables/useConfirmAction';

export default {
  components: {
    AppModal,
    StatusBadge,
    AppSpinner
  },
  setup() {
    const crmStore = useCrmStore();
    const isAssignModalOpen = ref(false);
    const selectedLead = ref(null);
    const selectedConsultantId = ref(null);

    const { run: confirmAction } = useConfirmAction();

    onMounted(async () => {
      await Promise.all([
        crmStore.fetchLeads(),
        crmStore.fetchConsultants()
      ]);
    });

    onUpdated(() => {
      if (
        selectedLead.value &&
        !crmStore.leads.find(lead => lead.id === selectedLead.value.id)
      ) {
        isAssignModalOpen.value = false;
        selectedLead.value = null;
        selectedConsultantId.value = null;
      }
    });

    onUnmounted(() => {
      isAssignModalOpen.value = false;
      selectedLead.value = null;
      selectedConsultantId.value = null;
    });

    const openAssignModal = (lead) => {
      selectedLead.value = lead;
      selectedConsultantId.value = null;
      isAssignModalOpen.value = true;
    };

    const confirmAssign = () => {
      if (!selectedLead.value || !selectedConsultantId.value) return;

      const payload = {
        entityId: selectedLead.value.id,
        newOwnerId: selectedConsultantId.value
      };

      crmStore.assignLead(payload);
      isAssignModalOpen.value = false;
    };

    const handleDeleteLead = async (leadId) => {
      await confirmAction({
        message: 'Are you sure you want to delete this lead?',
        action: () => crmStore.deleteLead(leadId),
        onError: () => alert('Failed to delete lead')
      });
    };

    return {
      crmStore,
      isAssignModalOpen,
      selectedLead,
      selectedConsultantId,
      openAssignModal,
      confirmAssign,
      handleDeleteLead
    };
  }
};
</script>
