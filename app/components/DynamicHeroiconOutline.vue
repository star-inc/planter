<template>
  <component
    :is="iconInstance"
    v-bind="props"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import * as allIcons from '@heroicons/vue/24/outline';

const props = defineProps<{
  name: string;
  class?: string;
}>();

const iconInstance = computed(
    () => (allIcons as Record<string, import('vue').Component>)[props.name],
);
</script>
