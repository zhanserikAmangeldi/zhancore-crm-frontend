<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-brand-dark">Project Details</h1>
          <p class="text-sm text-gray-500">Update project information and timeline.</p>
        </div>
        <router-link
          to="/consultant/projects"
          class="text-sm font-medium text-brand-indigo hover:text-brand-dark"
        >
          Back to Projects
        </router-link>
      </div>
      <div v-if="project" class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-xl p-4">
        <div>
          <p class="text-xs uppercase text-gray-400">Client</p>
          <p class="font-semibold text-brand-dark">{{ project.clientName }}</p>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-400">Owner</p>
          <p class="font-semibold text-brand-indigo">{{ project.ownerName }}</p>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-400">Created</p>
          <p class="font-semibold text-gray-700">{{ formatDate(project.createdAt) }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model="form.name"
            label="Project name"
            placeholder="CRM Implementation"
            required
          />
          <AppInput
            v-model.number="form.totalPrice"
            label="Total Price (KZT)"
            type="number"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model="form.startDate"
            label="Start Date"
            type="datetime-local"
            required
          />
          <AppInput
            v-model="form.endDate"
            label="End Date"
            type="datetime-local"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5 w-full">
          <label class="text-sm font-medium text-brand-dark/80">Project Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-brand-dark w-full resize-none"
            placeholder="Explain scope, milestones, and deliverables."
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5 w-full">
            <label class="text-sm font-medium text-brand-dark/80">Status</label>
            <select
              v-model="form.status"
              class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-brand-dark bg-white"
            >
              <option value="Planning">Planning</option>
              <option value="Development">Development</option>
              <option value="In Progress">In Progress</option>
              <option value="Support">Support</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <label class="flex items-center gap-3 text-sm font-medium text-brand-dark/80 mt-6">
            <input
              type="checkbox"
              v-model="form.isSupportIncluded"
              class="h-4 w-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
            />
            Support included
          </label>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link
            to="/consultant/projects"
            class="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </router-link>
          <AppButton :type="'submit'" :disabled="isSubmitting">
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Save Changes</span>
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCrmStore } from '@/stores/crm';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

const crmStore = useCrmStore();
const route = useRoute();
const router = useRouter();

const project = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  projectId: '',
  name: '',
  description: '',
  totalPrice: 0,
  startDate: '',
  endDate: '',
  isSupportIncluded: false,
  status: 'Planning'
});

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

const loadProject = async () => {
  const projectId = route.params.id;
  if (!projectId) return;
  try {
    project.value = await crmStore.fetchProjectById(projectId);
    form.projectId = projectId;
    form.name = project.value.name || '';
    form.description = project.value.description || '';
    form.totalPrice = project.value.totalPrice ?? 0;
    form.startDate = toInputDateTime(project.value.startDate);
    form.endDate = toInputDateTime(project.value.endDate);
    form.isSupportIncluded = Boolean(project.value.isSupportIncluded);
    form.status = project.value.status || 'Planning';
  } catch (error) {
    errorMessage.value = 'Failed to load project details.';
    console.error(error);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    const payload = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null
    };
    await crmStore.updateProjectDetails(payload);
    router.push('/consultant/projects');
  } catch (error) {
    errorMessage.value = 'Failed to update project, check the data.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadProject);
</script>
