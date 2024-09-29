<template>
  <v-list-item :prepend-icon="icon" :href="props.httpUrl" rel="noreferrer noopener" target="_blank">
    <v-list-item-title>
      {{ props.name }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ props.description }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  httpStatus: {
    type: Number,
    required: true,
  },
  httpUrl: {
    type: String,
    required: true,
  }
});

const icon = computed(() => {
  switch (props.httpStatus) {
    case 200:
    case 204: {
      return "mdi-check-circle-outline";
    }
    default: {
      return "mdi-alert-circle-outline";
    }
  }
});
</script>
