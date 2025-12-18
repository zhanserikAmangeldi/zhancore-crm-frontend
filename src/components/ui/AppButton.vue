<template>
  <button
      :type="type"
      class="px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      :class="variantClasses"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }
});

const variantClasses = computed(() => {
  if (props.variant === 'secondary') {
    return 'bg-brand-indigo text-white hover:bg-brand-indigo/90';
  }
  return 'bg-brand-teal text-white hover:bg-brand-teal/90';
});
</script>