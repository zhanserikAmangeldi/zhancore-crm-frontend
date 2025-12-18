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
          <th class="px-6 py-4 text-right">Action</th>
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
            <button
                v-if="lead.status === 'New'"
                @click="openQualifyModal(lead)"
                class="text-sm font-medium text-brand-teal hover:text-brand-dark bg-brand-teal/10 hover:bg-brand-teal/20 px-4 py-2 rounded-lg transition-all"
            >
              Qualify
            </button>
            <span v-else class="text-xs text-gray-400">Completed</span>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="crmStore.leads.length === 0" class="p-8 text-center text-gray-400">
        You have no any active leads
      </div>
    </div>

    <AppModal
        :is-open="isModalOpen"
        title="Lead Qualify"
        @close="closeModal"
    >
      <form @submit.prevent="handleSaveAndQualify" class="flex flex-col gap-4">

        <div class="space-y-3">
          <h4 class="text-sm font-bold text-brand-indigo uppercase tracking-wider border-b border-gray-100 pb-1">Contacts</h4>
          <div class="grid grid-cols-2 gap-4">
            <AppInput
                v-model="form.phone"
                label="Telephone number"
                placeholder="+7-701-..."
                required
            />
            <AppInput
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="client@mail.com"
                required
            />
          </div>
        </div>

        <!-- Блок: О проекте -->
        <div class="space-y-3 mt-2">
          <h4 class="text-sm font-bold text-brand-indigo uppercase tracking-wider border-b border-gray-100 pb-1">Project Details</h4>

          <div class="flex flex-col gap-1.5 w-full">
            <label class="text-sm font-medium text-brand-dark/80">Project Description</label>
            <textarea
                v-model="form.projectDescription"
                rows="3"
                class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-brand-dark w-full resize-none"
                placeholder="What to do"
                required
            ></textarea>
          </div>

          <AppInput
              v-model.number="form.estimatedPrice"
              label="Estimated Budget (KZT)"
              type="number"
              placeholder="1000000"
              required
          />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-2 rounded">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </button>

          <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-brand-teal text-white rounded-lg font-semibold hover:bg-brand-teal/90 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Qualify</span>
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppModal from '@/components/ui/AppModal.vue';
import AppInput from '@/components/ui/AppInput.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';

const crmStore = useCrmStore();
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  leadId: '',
  phone: '',
  email: '',
  projectDescription: '',
  estimatedPrice: null
});

onMounted(() => {
  crmStore.fetchMyLeads();
});

const openQualifyModal = (lead) => {
  form.leadId = lead.id;
  form.phone = '';
  form.email = '';
  form.projectDescription = '';
  form.estimatedPrice = null;

  errorMessage.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSaveAndQualify = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const detailsPayload = { ...form };
    console.log('Sending Details:', detailsPayload);
    await crmStore.addLeadDetails(detailsPayload);

    console.log('Qualifying Lead:', form.leadId);
    await crmStore.qualifyLead(form.leadId);

    closeModal();
  } catch (error) {
    errorMessage.value = 'Failed to add lead, check data';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>