<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-brand-indigo/5 text-xs uppercase text-brand-indigo font-semibold">
        <tr>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Client</th>
          <th class="px-6 py-4">Budget</th>
          <th class="px-6 py-4 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="opp in crmStore.opportunities" :key="opp.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4">
            <div class="font-medium text-brand-dark">{{ opp.name || 'Без названия' }}</div>
            <div class="text-xs text-gray-400">ID: {{ opp.id.slice(0,8) }}...</div>
          </td>
          <td class="px-6 py-4 text-gray-600">
            {{ opp.clientName || 'Неизвестно' }}
          </td>
          <td class="px-6 py-4 text-gray-800 font-medium">
            {{ opp.price ? opp.price.toLocaleString() + ' ₸' : '-' }}
          </td>
          <td class="px-6 py-4 text-right">
            <button
                v-if="opp.status === 'New'"
                @click="openProjectModal(opp)"
                class="text-sm font-medium text-white bg-brand-indigo hover:bg-brand-indigo/90 px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              To Project (Qualify)
            </button>
            <span v-else class="text-xs text-gray-400">Completed</span>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="crmStore.opportunities.length === 0" class="p-8 text-center text-gray-400">
        No opportunities found. First qualify leads.
      </div>
    </div>

    <AppModal
        :is-open="isModalOpen"
        title="Final qualification: Project"
        @close="closeModal"
    >
      <form @submit.prevent="handleQualifyToProject" class="flex flex-col gap-4">

        <div class="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-2">
          You transfer opportunity to <b>Project</b>. Fill final data of opportunity.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
              v-model="form.name"
              label="Project name"
              placeholder="Integrate CRM..."
              required
          />
          <AppInput
              v-model.number="form.price"
              label="Final Budget (KZT)"
              type="number"
              required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
              v-model="form.startDate"
              label="Date of Start"
              type="datetime-local"
              required
          />
          <AppInput
              v-model="form.endDate"
              label="Date of End"
              type="datetime-local"
              required
          />
        </div>

        <div class="flex flex-col gap-1.5 w-full">
          <label class="text-sm font-medium text-brand-dark/80">Work Scope</label>
          <textarea
              v-model="form.workScope"
              rows="4"
              class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-brand-dark w-full resize-none"
              placeholder="Describe your project phases, technologies and etc."
              required
          ></textarea>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-brand-dark/80">Final Probability of Success (%)</label>
          <input
              type="range"
              v-model.number="form.probability"
              min="0" max="100"
              class="w-full accent-brand-teal cursor-pointer"
          />
          <div class="text-right text-sm font-bold text-brand-teal">{{ form.probability }}%</div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-brand-teal text-white rounded-lg font-semibold hover:bg-brand-teal/90 shadow-lg flex items-center gap-2"
          >
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create Project</span>
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

const crmStore = useCrmStore();
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  opportunityId: '',
  name: '',
  price: 0,
  workScope: '',
  startDate: '',
  endDate: '',
  probability: 75
});

onMounted(() => {
  crmStore.fetchMyOpportunities();
});

const openProjectModal = (opp) => {
  form.opportunityId = opp.id;
  form.name = opp.name || '';
  form.price = opp.estimatedPrice || 0;
  form.workScope = '';
  form.startDate = '';
  form.endDate = '';
  form.probability = opp.probability || 75;

  errorMessage.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleQualifyToProject = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const detailsPayload = { ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };
    console.log('Sending Details:', detailsPayload);
    await crmStore.addOpportunityDetails(detailsPayload);

    const payload = {
      opportunityId: detailsPayload.opportunityId,
    };

    console.log('Qualifying Lead:', payload.opportunityId);
    await crmStore.qualifyOpportunity(payload);

    closeModal();
  } catch (error) {
    errorMessage.value = 'Failed to create Project, please check the data';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>