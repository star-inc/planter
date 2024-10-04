<template>
  <v-list-group v-if="props.children" :color="color" :value="listKey" no-action>
    <template v-slot:activator="{ props: itemProps }">
      <v-list-item v-bind="itemProps" :prepend-icon="icon">
        <v-list-item-title>
          {{ props.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ props.description }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <index-node-item v-for="(i, j) in props.children" :key="j" v-bind="i" />
  </v-list-group>
  <index-node-item v-else v-bind="props" />
</template>

<script setup>
import { computed } from "vue";

import IndexNodeItem from "./IndexNodeItem.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
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
  },
  children: {
    type: [Array, null],
    required: true,
  },
});

const listKey = computed(() => {
  return `node-${props.id}`
});

const color = computed(() => {
  switch (props.httpStatus) {
    case 200:
    case 204: {
      return "primary";
    }
    default: {
      return "red";
    }
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
