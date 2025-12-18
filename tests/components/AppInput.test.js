import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppInput from '@/components/ui/AppInput.vue';

describe('AppInput', () => {
  it('emits update on input change', async () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', label: 'Name' }
    });

    const input = wrapper.find('input');
    await input.setValue('Alice');

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Alice']);
  });

  it('respects disabled state', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', disabled: true }
    });

    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
  });
});
