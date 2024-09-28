<template>
  <div>
    {{ text }}
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {client} from "./clients/planter.js"

const text = ref("Loading...");

onMounted(() => {
  client.
    get("states").
    then((res) => res.json()).
    then((json) => {
      text.value = json;
    });
});
</script>
