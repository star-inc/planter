<template>
  <v-card
      :height="$store.state.screenSize.height - 105"
      :width="$store.state.screenSize.width"
      class="mx-auto overflow-y-auto"
      flat
  >
    <v-container>
      <v-card flat>
        <v-card-title>p.mume</v-card-title>
        <v-card-subtitle>
          All static status page system.
        </v-card-subtitle>
      </v-card>
      <v-card flat>
        <v-card-title>License</v-card-title>
        <v-card-text v-html="license"/>
      </v-card>
      <v-card flat>
        <v-card-text>
          &copy; 2021 <a href="https://starinc.xyz">Star Inc.</a>
        </v-card-text>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
import License from "!raw-loader!@/../LICENSE";

export default {
  name: "About",
  computed: {
    license: () => License.replace(/\n/g, "<br />"),
  },
};
</script>
