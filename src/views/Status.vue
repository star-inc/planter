<template>
  <div>
    <StatusBar
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      :information="item"
    />
  </div>
</template>

<script>
import StatusBar from "@/components/StatusBar.vue";
import { load } from "js-yaml";

import Config from "!raw-loader!@/../config.yaml";

export default {
  name: "Application",
  components: { StatusBar },
  data: () => ({
    items: load(Config).sites,
  }),
};
</script>

<style lang="scss" scoped>
.md-app {
  width: 100%;
  height: 100vh;
}

.md-toolbar {
  background: #fff;
}

.md-drawer {
  width: 250px;
}

.logo {
  width: auto;
  height: 100px;
  padding: 15px;
}
</style>
