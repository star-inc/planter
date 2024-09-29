<template>
  <v-container>
    <v-card v-for="(i, j) in dataset" :key="j" flat>
      <v-card-title>{{ i.name }}</v-card-title>
      <v-list v-model:opened="nodeExpanded" lines="two">
        <index-node-bar v-for="(k, l) in i.nodes" v-bind="k" :key="l" />
      </v-list>
    </v-card>
    <v-card flat>
      <v-card-text>
        Last incident occurred: Unknown
      </v-card-text>
    </v-card>
    <v-card class="text-center" flat>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="!isExpanded" @click="isExpanded = true">
          Expand
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <v-expand-transition>
      <div v-show="isExpanded">
        <index-scheduled-maintenance />
        <index-incident-overview />
        <index-metrics-overview />
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { client } from "../clients/planter.js";

import IndexNodeBar from "../components/IndexNodeBar";
import IndexIncidentOverview from "../components/IndexIncidentOverview";
import IndexMetricsOverview from "../components/IndexMetricsOverview";
import IndexScheduledMaintenance from "../components/IndexScheduledMaintenance";

const isExpanded = ref(false);
const nodeExpanded = ref([]);

const nodes = reactive([]);
const types = reactive({});
const links = reactive({});

const dataset = computed(() => Object.
  entries(types).
  map(([i, j]) => ({
    ...j,
    nodes: nodes.filter(
      (k) => k.typeId?.toString() === i,
    ).map((k) => ({
      ...k,
      children: links[k.linkId]?.map(
        (l) => nodes.find((m) => m.linkId === l),
      ),
    })),
  }))
);

onMounted(() => {
  client.
    get("nodes").
    then((res) => res.json()).
    then((data) => {
      nodes.push(...data.nodes);
      Object.assign(types, data.types);
      Object.assign(links, data.links);
    });
})
</script>
