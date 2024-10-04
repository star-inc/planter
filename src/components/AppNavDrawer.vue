<template>
  <v-navigation-drawer v-model="model" location="right" temporary>
    <v-list nav>
      <v-list-item link to="/about">
        <v-list-item-title class="text-h6">
          Planter
        </v-list-item-title>
        <v-list-item-subtitle>
          Status page of {{ barTitle }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item link to="/">
        <v-list-item-title>
          Home
        </v-list-item-title>
      </v-list-item>
      <v-list-item link to="/incidents">
        <v-list-item-title>
          Incidents
        </v-list-item-title>
      </v-list-item>
      <v-list-item link to="/metrics">
        <v-list-item-title>
          Metrics
        </v-list-item-title>
      </v-list-item>
      <v-list-item link to="/about">
        <v-list-item-title>
          About
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <template #append>
      <div class="pa-2">
        <v-btn block color="primary" link rounded to="/raise">
          Raise
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
const {
  VITE_APP_BAR_TITLE: barTitle,
} = import.meta.env;

const model = defineModel({
  type: Boolean,
  required: true,
});
</script>
