<template>
  <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium', colorClass]">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ status: String });

const colorClass = computed(() => {
  switch (props.status) {
    case 'New': return 'bg-blue-100 text-blue-800';
    case 'Assigned': return 'bg-brand-indigo/20 text-brand-indigo';
    case 'Qualified': return 'bg-green-100 text-green-800';
    case 'Planning': return 'bg-brand-teal/20 text-brand-teal';
    default: return 'bg-gray-100 text-gray-800';
  }
});
</script>