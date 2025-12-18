<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-light relative overflow-hidden">
    <!-- Декоративные круги на фоне -->
    <div class="absolute -top-20 -left-20 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl"></div>

    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl z-10 border border-gray-100">
      <div class="flex flex-col items-center mb-8">
        <AppLogo class-name="w-24 h-24 mb-4" />
        <h1 class="text-2xl font-bold text-brand-dark">Zhancore CRM</h1>
        <p class="text-gray-500 text-sm mt-1"></p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
        <AppInput
            v-model="form.username"
            label="Username"
            placeholder="Enter your username"
        />

        <AppInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="••••••••"
        />

        <div v-if="errorMessage" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {{ errorMessage }}
        </div>

        <AppButton type="submit" :disabled="isLoading" class="mt-2 w-full">
          {{ isLoading ? 'Login...' : 'Login' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppLogo from '@/components/ui/AppLogo.vue';
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: ''
});
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post(`/api/auth/login`, form);
    const { token, role } = response.data;

    authStore.login(token, role);
    console.log(token, role);

    if (role === 'Admin') {
      console.log("push to admin")
      await router.push('/admin');
    } else {
      console.log("push to consultant")
      await router.push('/consultant');
    }
  } catch (error) {
    errorMessage.value = error;
  } finally {
    isLoading.value = false;
  }
};
</script>