<template>
  <div class="space-y-6">
    <div class="flex justify-end items-center">
      <button
          @click="isModalOpen = true"
          class="bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal/90 flex items-center gap-2 transition-colors shadow-md"
      >
        <span>+</span> Add Consultant
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse table-auto">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
        <tr>
          <th class="px-2 py-4">ID</th>
          <th class="px-6 py-4">Username</th>
          <th class="px-6 py-4">Role</th>
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
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';

const crmStore = useCrmStore();
const isModalOpen = ref(false);

const form = reactive({
  name: '',
  username: '',
  password: '',
  role: 'Consultant'
});

onMounted(() => {
  crmStore.fetchUsers();
});

const handleCreateUser = async () => { // TODO: add opportunity to create users
  try {
    await crmStore.createUser({ ...form });
    isModalOpen.value = false;

    form.name = '';
    form.username = '';
    form.password = '';
  } catch (e) {
    alert('failed to create user');
  }
};
</script>