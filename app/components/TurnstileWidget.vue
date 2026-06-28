<template>
  <div ref="container"/>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';

const props = defineProps<{
  siteKey: string;
  modelValue?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [token: string];
  verify: [token: string];
}>();

const container = ref<HTMLElement | null>(null);
const widgetId = ref<string | null>(null);

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
}

interface TurnstileInstance {
  render: (element: string | HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
}

const getTurnstile = () => (window as Window & {turnstile?: TurnstileInstance}).turnstile;

const renderWidget = () => {
  const turnstile = getTurnstile();
  if (!container.value || !turnstile) return;

  widgetId.value = turnstile.render(container.value, {
    'sitekey': props.siteKey,
    'callback': (token: string) => {
      emit('update:modelValue', token);
      emit('verify', token);
    },
    'expired-callback': () => {
      emit('update:modelValue', '');
    },
    'error-callback': () => {
      emit('update:modelValue', '');
    },
  });
};

onMounted(() => {
  if (getTurnstile()) {
    renderWidget();
  } else {
    if (!document.getElementById('cloudflare-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (getTurnstile()) {
        clearInterval(interval);
        renderWidget();
      }
    }, 100);
  }
});

onBeforeUnmount(() => {
  const turnstile = getTurnstile();
  if (widgetId.value && turnstile) {
    turnstile.remove(widgetId.value);
  }
});
</script>
