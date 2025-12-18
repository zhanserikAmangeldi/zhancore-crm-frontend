<template>
  <div class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="h-10 w-10 rounded-full border-4 border-brand-teal/30 border-t-brand-teal animate-spin"></div>
    <span class="mt-3 text-sm text-gray-500">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'Loading...' }
});
</script>
