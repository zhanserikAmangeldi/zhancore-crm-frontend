import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppSpinner from '@/components/ui/AppSpinner.vue';

describe('AppSpinner', () => {
  it('renders provided label text', () => {
    const wrapper = mount(AppSpinner, {
      props: { label: 'Loading data...' }
    });

    expect(wrapper.text()).toContain('Loading data...');
  });
});
