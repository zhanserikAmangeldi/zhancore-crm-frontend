<template>
  <div class="space-y-6">
    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-wide text-gray-400">Username</p>
          <p class="text-xl font-semibold text-brand-dark">{{ user.username }}</p>
          <p class="text-sm text-gray-500">ID: <span class="font-mono text-xs">{{ user.id }}</span></p>
        </div>
        <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
        >
          {{ user.role }}
        </span>
      </div>
    </div>

    <div class="space-y-3">
      <div>
        <p class="text-sm font-semibold text-brand-dark">Change Password</p>
        <p class="text-xs text-gray-500">Set a new password for this user. Minimum 6 characters.</p>
      </div>
      <AppInput
          v-model="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter a secure password"
      />
      <div class="flex justify-end gap-3">
        <AppButton variant="secondary" type="button" @click="resetPassword">Reset</AppButton>
        <AppButton
            type="button"
            :disabled="newPassword.length < 6"
            @click="submitPassword"
        >
          Save
        </AppButton>
      </div>
    </div>

    <div class="border-t pt-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-brand-dark">Danger Zone</p>
          <p class="text-xs text-gray-500">Delete this user and revoke their access.</p>
        </div>
        <button
            type="button"
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          Delete User
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['change-password', 'delete-user']);

const newPassword = ref('');

watch(
    () => props.user?.id,
    () => {
      newPassword.value = '';
    }
);

const submitPassword = () => {
  if (!props.user?.id || newPassword.value.length < 6) return;
  emit('change-password', { userId: props.user.id, newPassword: newPassword.value });
};

const resetPassword = () => {
  newPassword.value = '';
};

const confirmDelete = () => {
  emit('delete-user', props.user.id);
};
</script>
