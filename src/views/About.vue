<template>
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
