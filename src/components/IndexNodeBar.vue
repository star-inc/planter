<template>
  <v-list-group v-if="props.serviceCount" :color="color" :value="listKey" no-action>
    <template v-slot:activator="{ props: itemProps }">
      <v-list-item v-bind="itemProps" :prepend-icon="icon" :title="props.displayName" />
    </template>
    <index-service-bar v-for="(i, j) in services" :key="j" v-bind="i" />
  </v-list-group>
  <v-list-item v-else :prepend-icon="icon" :title="props.displayName" />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { client } from "../clients/planter.js";

import IndexServiceBar from "./IndexServiceBar.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  httpStatus: {
    type: Number,
    required: true,
  },
  serviceCount: {
    type: Number,
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

const services = reactive([]);
onMounted(() => {
  client.
    get(`nodes/${props.id}`).
    then((res) => res.json()).
    then((data) => services.push(...data));
});
</script>
