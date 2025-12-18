<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-brand-dark">Lead Qualification</h1>
          <p class="text-sm text-gray-500">Fill details and qualify the lead to an opportunity.</p>
        </div>
        <router-link
          to="/consultant/leads"
          class="text-sm font-medium text-brand-indigo hover:text-brand-dark"
        >
          Back to Leads
        </router-link>
      </div>
      <div v-if="lead" class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-xl p-4">
        <div>
          <p class="text-xs uppercase text-gray-400">Client</p>
          <p class="font-semibold text-brand-dark">{{ lead.clientName }}</p>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-400">Status</p>
          <p class="font-semibold text-brand-indigo">{{ lead.status }}</p>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-400">Created</p>
          <p class="font-semibold text-gray-700">{{ formatDate(lead.createdAt) }}</p>
        </div>
        <div class="md:col-span-3">
          <p class="text-xs uppercase text-gray-400">Initial Request</p>
          <p class="text-sm text-gray-700">{{ lead.description }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="isReadOnly" class="bg-amber-50 border border-amber-100 text-amber-700 text-sm p-3 rounded-lg">
          Lead is already qualified or closed. Details are read-only.
        </div>

        <div class="space-y-3">
          <h2 class="text-sm font-bold text-brand-indigo uppercase tracking-wider border-b border-gray-100 pb-2">
            Contacts
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              v-model="form.phone"
              label="Telephone number"
              placeholder="+7-701-..."
              :disabled="isReadOnly"
              required
            />
            <AppInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="client@mail.com"
              :disabled="isReadOnly"
              required
            />
          </div>
        </div>

        <div class="space-y-3">
          <h2 class="text-sm font-bold text-brand-indigo uppercase tracking-wider border-b border-gray-100 pb-2">
            Project Details
          </h2>
          <div class="flex flex-col gap-1.5 w-full">
            <label class="text-sm font-medium text-brand-dark/80">Project Description</label>
            <textarea
              v-model="form.projectDescription"
              rows="4"
              :disabled="isReadOnly"
              class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-brand-dark w-full resize-none"
              placeholder="What to build"
              required
            ></textarea>
          </div>
          <AppInput
            v-model.number="form.estimatedPrice"
            label="Estimated Budget (KZT)"
            type="number"
            placeholder="1000000"
            :disabled="isReadOnly"
            required
          />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link
            to="/consultant/leads"
            class="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </router-link>
          <AppButton :type="'submit'" :disabled="isSubmitting || isReadOnly">
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>{{ isReadOnly ? 'Read Only' : 'Qualify Lead' }}</span>
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

const lead = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  leadId: '',
  phone: '',
  email: '',
  projectDescription: '',
  estimatedPrice: null
});

const isReadOnly = computed(() => lead.value && lead.value.status !== 'New');

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
};

const loadLead = async () => {
  const leadId = route.params.id;
  if (!leadId) return;
  try {
    lead.value = await crmStore.fetchLeadById(leadId);
    form.leadId = leadId;
    form.phone = lead.value.phone || '';
    form.email = lead.value.email || '';
    form.projectDescription = lead.value.projectDescription || '';
    form.estimatedPrice = lead.value.estimatedPrice ?? null;
  } catch (error) {
    errorMessage.value = 'Failed to load lead details.';
    console.error(error);
  }
};

const handleSubmit = async () => {
  if (isReadOnly.value) {
    router.push('/consultant/leads');
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    await crmStore.addLeadDetails({ ...form });
    await crmStore.qualifyLead(form.leadId);
    router.push('/consultant/leads');
  } catch (error) {
    errorMessage.value = 'Failed to qualify lead, check the data.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadLead);
</script>
