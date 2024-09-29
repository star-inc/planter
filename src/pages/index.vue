<template>
  <v-container>
    <v-list v-model:opened="nodeExpanded">
      <index-node-bar v-for="(i, j) in nodes" :key="j" v-bind="i" />
    </v-list>
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
        <index-extra-services />
        <index-scheduled-maintenance />
        <index-incident-overview />
        <index-metrics-overview />
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { client } from "../clients/planter.js";

import IndexNodeBar from "../components/IndexNodeBar";
import IndexExtraServices from "../components/IndexExtraServices";
import IndexIncidentOverview from "../components/IndexIncidentOverview";
import IndexMetricsOverview from "../components/IndexMetricsOverview";
import IndexScheduledMaintenance from "../components/IndexScheduledMaintenance";

const isExpanded = ref(false);
const nodeExpanded = ref([]);

const nodes = reactive([]);
onMounted(() => {
  client.
    get("nodes").
    then((res) => res.json()).
    then((data) => nodes.push(...data));
})
</script>
