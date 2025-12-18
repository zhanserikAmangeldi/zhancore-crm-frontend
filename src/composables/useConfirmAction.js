import { ref } from 'vue';

export const useConfirmAction = () => {
  const isWorking = ref(false);

  const run = async ({ message, action, onError }) => {
    if (isWorking.value) return;
    if (!confirm(message)) return;

    isWorking.value = true;
    try {
      await action();
    } catch (err) {
      if (onError) onError(err);
      else alert('Action failed');
    } finally {
      isWorking.value = false;
    }
  };

  return { isWorking, run };
};
