import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StatusBadge from '@/components/ui/StatusBadge.vue';

describe('StatusBadge', () => {
  it('applies color class for New status', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'New' }
    });

    expect(wrapper.classes()).toContain('bg-blue-100');
  });
});
