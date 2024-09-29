<template>
  <v-container>
    <v-card v-for="(i, j) in dataset" :key="j" flat>
      <v-card-title>{{ i.name }}</v-card-title>
      <v-card-subtitle>{{ i.description }}</v-card-subtitle>
      <v-list v-model:opened="nodeExpanded" lines="two">
        <index-node-bar v-for="(k, l) in i.nodes" v-bind="k" :key="l" />
      </v-list>
    </v-card>
    <v-card flat>
      <v-card-text>
        Last incident occurred: Unknown
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { client } from "../clients/planter.js";

import IndexNodeBar from "../components/IndexNodeBar";

const isExpanded = ref(false);
const nodeExpanded = ref([]);

const nodes = reactive([]);
const types = reactive({});
const links = reactive({});

const dataset = computed(() => Object.
  entries(types).
  sort(
    (i, j) => i[1].priority < j[1].priority,
  ).
  sort(
    (i, j) => i[1].name < j[1].name,
  ).
  map(([i, j]) => ({
    ...j,
    nodes: nodes.filter(
      (k) => k.typeId?.toString() === i,
    ).
      sort(
        (i, j) => i.name < j.name,
      ).
      map((k) => ({
        ...k,
        children: links[k.linkId]?.
          map(
            (l) => nodes.find((m) => m.linkId === l),
          ).
          sort(
            (i, j) => i.name < j.name,
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
