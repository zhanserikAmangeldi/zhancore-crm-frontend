<template>
  <div class="flex h-screen bg-brand-light">
    <!-- Sidebar -->
    <aside class="w-64 bg-brand-dark text-white flex flex-col shadow-xl">
      <div class="p-6 flex items-center gap-3 border-b border-gray-700">
        <AppLogoText class-name="w-64 h-24" />
      </div>

      <nav class="flex-1 py-6 px-3 space-y-1">
        <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            active-class="bg-brand-teal text-white shadow-md"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <button @click="handleLogout" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-full">
          Exit
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">
        <h2 class="text-xl font-semibold text-brand-dark">{{ currentPageTitle }}</h2>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-bold text-brand-dark">{{ authStore.userRole }}</p>
            <p class="text-xs text-gray-500">Authorized</p>
          </div>
          <div class="w-10 h-10 bg-brand-indigo rounded-full text-white flex items-center justify-center font-bold">
            {{ authStore.userRole?.[0] || 'U' }}
          </div>
        </div>
      </header>

      <!-- Page View -->
      <main class="flex-1 overflow-auto p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppLogoText from "@/components/ui/AppLogoText.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navItems = computed(() => {
  if (authStore.isAdmin) {
    return [
      { name: 'Leads', path: '/admin/leads' },
      { name: 'Clients', path: '/admin/clients'},
      { name: 'Opportunities', path: '/admin/opportunities' },
      { name: 'Projects', path: '/admin/projects' },
      { name: 'Users', path: '/admin/users' }
    ];
  } else {
    return [
      { name: 'My Leads', path: '/consultant/leads' },
      { name: 'My Opportunities', path: '/consultant/opportunities' },
      { name: 'My Projects', path: '/consultant/projects' }
    ];
  }
});

const currentPageTitle = computed(() => {
  return navItems.value.find(i => i.path === route.path)?.name || 'Dashboard';
});

const handleLogout = () => {
  authStore.logout();
};
</script>
