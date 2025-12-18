<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-brand-dark">Opportunity Qualification</h1>
          <p class="text-sm text-gray-500">Finalize details and close the opportunity as a project.</p>
        </div>
        <router-link
          to="/consultant/opportunities"
          class="text-sm font-medium text-brand-indigo hover:text-brand-dark"
        >
          Back to Opportunities
        </router-link>
      </div>
      <div v-if="opportunity" class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-xl p-4">
        <div>
          <p class="text-xs uppercase text-gray-400">Client</p>
          <p class="font-semibold text-brand-dark">{{ opportunity.clientName }}</p>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-400">Status</p>
          <p class="font-semibold text-brand-indigo">{{ opportunity.status }}</p>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-400">Created</p>
          <p class="font-semibold text-gray-700">{{ formatDate(opportunity.createdAt) }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-3">
          <h2 class="text-sm font-bold text-brand-indigo uppercase tracking-wider border-b border-gray-100 pb-2">
            Opportunity Details
          </h2>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-brand-dark/80">Lead</label>
            <div
              class="px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-brand-dark"
            >
              <router-link
                v-if="opportunity?.leadId"
                :to="`/consultant/leads/${opportunity.leadId}`"
                class="text-sm font-medium text-brand-teal hover:text-brand-dark"
              >
                {{ opportunity.leadId }}
              </router-link>
              <span v-else class="text-sm text-gray-500">Not linked</span>
            </div>
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
              placeholder="Describe scope, stages, and deliverables."
              required
            ></textarea>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-brand-dark/80">Probability of Success (%)</label>
            <input
              type="range"
              v-model.number="form.probability"
              min="0"
              max="100"
              class="w-full accent-brand-teal cursor-pointer"
            />
            <div class="text-right text-sm font-bold text-brand-teal">{{ form.probability }}%</div>
          </div>
        </div>

        <div class="space-y-3">
          <h2 class="text-sm font-bold text-brand-indigo uppercase tracking-wider border-b border-gray-100 pb-2">
            Project Settings
          </h2>
          <label class="flex items-center gap-3 text-sm font-medium text-brand-dark/80">
            <input
              type="checkbox"
              v-model="form.isSupportIncluded"
              class="h-4 w-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
            />
            Include support in the project
          </label>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link
            to="/consultant/opportunities"
            class="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </router-link>
          <AppButton :type="'submit'" :disabled="isSubmitting">
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>{{ canQualify ? 'Create Project' : 'Save Changes' }}</span>
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCrmStore } from '@/stores/crm';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

const crmStore = useCrmStore();
const route = useRoute();
const router = useRouter();

const opportunity = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  opportunityId: '',
  name: '',
  price: 0,
  workScope: '',
  startDate: '',
  endDate: '',
  probability: 75,
  isSupportIncluded: false
});

const canQualify = computed(() => !opportunity.value || opportunity.value.status === 'New');

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
};

const toInputDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const loadOpportunity = async () => {
  const opportunityId = route.params.id;
  if (!opportunityId) return;
  try {
    opportunity.value = await crmStore.fetchOpportunityById(opportunityId);
    form.opportunityId = opportunityId;
    form.name = opportunity.value.name || '';
    form.price = opportunity.value.price ?? 0;
    form.workScope = opportunity.value.workScope || '';
    form.startDate = toInputDateTime(opportunity.value.startDate);
    form.endDate = toInputDateTime(opportunity.value.endDate);
    form.probability = opportunity.value.probability ?? 75;
  } catch (error) {
    errorMessage.value = 'Failed to load opportunity details.';
    console.error(error);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    const detailsPayload = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null
    };
    await crmStore.addOpportunityDetails(detailsPayload);
    if (canQualify.value) {
      await crmStore.qualifyOpportunity({
        opportunityId: detailsPayload.opportunityId,
        isSupportIncluded: detailsPayload.isSupportIncluded
      });
    }
    router.push('/consultant/opportunities');
  } catch (error) {
    errorMessage.value = 'Failed to create project, check the data.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadOpportunity);
</script>
