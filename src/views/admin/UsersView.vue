<template>
  <div class="space-y-6">
    <div class="flex justify-end items-center">
      <button
          @click="isModalOpen = true"
          class="bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal/90 flex items-center gap-2 transition-colors shadow-md"
      >
        <span>+</span> Add User
      </button>
    </div>

    <AppModal :isOpen="isModalOpen" title="Create User" @close="isModalOpen = false">
      <form @submit.prevent="handleCreateUser" class="space-y-4">
        <AppInput v-model="form.username" label="Username" placeholder="johndoe" />
        <AppInput v-model="form.password" label="Password" type="password" placeholder="at least 6 characters" />
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-brand-dark/80">Role</label>
          <select v-model="form.role" class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-200 bg-white">
            <option value="Consultant">Consultant</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="secondary" type="button" @click="isModalOpen = false">Cancel</AppButton>
          <AppButton :type="'submit'">Create</AppButton>
        </div>
      </form>
    </AppModal>

    <AppSpinner v-if="crmStore.isLoading" label="Loading users..." />

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse table-auto">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
        <tr>
          <th class="px-2 py-4">ID</th>
          <th class="px-6 py-4">Username</th>
          <th class="px-6 py-4">Role</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="user in crmStore.users" :key="user.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-2 py-2 text-xs text-gray-400 font-mono">
            {{ user.id }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-600 w-1/2">
            {{ user.username }}
          </td>
          <td class="px-6 py-4">
              <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
              >
                {{ user.role }}
              </span>
          </td>
          <td class="px-6 py-4 text-right">
            <button
                @click="openUserDetails(user)"
                class="text-sm text-brand-teal hover:text-brand-teal/80 font-semibold"
            >
              Details
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <AppModal :isOpen="isUserModalOpen" title="User Details" @close="closeUserModal">
      <UserDetailsForm
          v-if="selectedUser"
          :user="selectedUser"
          @change-password="handleChangePassword"
          @delete-user="handleDeleteUser"
      />
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import AppModal from '@/components/ui/AppModal.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import UserDetailsForm from '@/components/admin/UserDetailsForm.vue';
import AppSpinner from '@/components/ui/AppSpinner.vue';

const crmStore = useCrmStore();
const isModalOpen = ref(false);
const isUserModalOpen = ref(false);
const selectedUser = ref(null);

const form = reactive({
  name: '',
  username: '',
  password: '',
  role: 'Consultant'
});

onMounted(() => {
  crmStore.fetchUsers();
});

const openUserDetails = (user) => {
  selectedUser.value = user;
  isUserModalOpen.value = true;
};

const closeUserModal = () => {
  isUserModalOpen.value = false;
  selectedUser.value = null;
};

const handleCreateUser = async () => {
  if (!form.username || !form.password) {
    alert('Please fill username and password');
    return;
  }
  if (form.password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  try {
    await crmStore.createUser({ username: form.username, password: form.password, roleName: form.role });
    isModalOpen.value = false;

    form.name = '';
    form.username = '';
    form.password = '';
    form.role = 'Consultant';
  } catch (e) {
    alert('Failed to create user');
  }
};

const handleDeleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    await crmStore.deleteUser(userId);
    closeUserModal();
    alert('User deleted.');
  } catch (e) {
    alert('Failed to delete user');
  }
};

const handleChangePassword = async ({ userId, newPassword }) => {
  if (!newPassword || newPassword.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  try {
    await crmStore.changeUserPassword({ userId, newPassword });
    alert('Password updated successfully.');
  } catch (e) {
    alert('Failed to update password');
  }
};
</script>
