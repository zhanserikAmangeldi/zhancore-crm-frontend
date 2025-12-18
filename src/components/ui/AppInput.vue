<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium text-brand-dark/80">
      {{ label }}
    </label>
    <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-200 text-brand-dark bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` },
  disabled: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>
