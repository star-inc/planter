<template>
  <v-list-group
      v-model="showChildren"
      prepend-icon="mdi-school"
      no-action
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-list-group>
</template>

<script>
export default {
  name: "StatusBar",
  props: {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    metadata: {
      type: String,
      required: false,
      default: () => ""
    }
  },
  data: () => ({
    showChildren: false,
  }),
};
</script>
